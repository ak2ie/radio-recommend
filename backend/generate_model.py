import gensim
import MeCab
import csv
import os
import numpy as np
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os


class ProgramModel:
	def __init__(self, model_path):
		self.__model_path = model_path
		self.__model = gensim.models.KeyedVectors.load_word2vec_format("./cc.ja.300.vec")

		os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
		os.environ["GCLOUD_PROJECT"]="my_project"
		os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./serviceAccountKey.json"
		cred = credentials.Certificate("./serviceAccountKey.json")
		firebase_admin.initialize_app(credential=cred)
		self.__db = firestore.client()

# https://fasttext.cc/docs/en/crawl-vectors.html

	def __freq_words(self, text):
		''''
		テキストを形態素解析して、出現頻度順に単語をリスト化する

		Args:
			text (string): テキスト
		Returns:
			出現頻度順の単語一覧
		'''
		mecabTagger = MeCab.Tagger()
		noun_count = {}

		node = mecabTagger.parseToNode(text)
		while node:
			word = node.surface
			hinshi = node.feature.split(",")[0]
			if word in noun_count.keys() and hinshi == "名詞":
				noun_freq = noun_count[word]
				noun_count[word] = noun_freq + 1
			elif hinshi == "名詞":
				noun_count[word] = 1
			else:
				pass
			node = node.next

		noun_count = sorted(noun_count.items(), key=lambda x: x[1], reverse=True)

		return noun_count

	def __calc_vector(self, noun_count, topn):
		'''
		単語の一覧から頻出する上位N件を取得して、ベクトル化する
		
		Args:
			noun_count (array): 単語一覧
			topn (integer): 一覧から取得する件数
		Returns:
			array ベクトル
		'''
		vectors = []
		words = list(dict(noun_count[:topn]).keys())
		for word in words:
			if word in self.__model:
				vectors.append(self.__model[word].mean(axis=0))
			else:
				# モデルに存在しない場合はランダムな値を取得
				vectors.append(np.random.randn(self.__model.vector_size).mean(axis=0))
		return vectors

	def __get_similar_indexes(self, vectors, target):
		'''
		ベクトル値を基に類似度を計算する

		Args:
			vectors (float[]): ベクトル値一覧
			target (float): 類似度を計算したい値
		Returns:
			int[]: 引数のvectorsの類似順番（0オリジン）
		'''
		# 似たアイテムを探す
		# for i, vec in enumerate(vectors):
		# 内積（コサイン類似度=内積/ベクトルの大きさ(=1)=内積, -1.0:逆, 0:無関係, 1:似ている）
		score_vec = np.dot(vectors, target)
		# valueの順に決定
		similar_indexes = np.argsort(-score_vec)
		# 要素数3の配列になるはず
		return similar_indexes

	def generate(self, programs_csv_path):
		'''
		番組一覧と記事テキストから、番組類似度を算出しDBに保存する

		Args:
			programs_csv_path (string): 番組一覧CSVファイルパス
		Returns:
			なし
		'''

		print("処理開始")
		if not os.path.isfile(programs_csv_path):
			print("番組一覧CSVが存在しません!")
			return
		
		with open(programs_csv_path) as f:
			reader = csv.DictReader(f)
			vectors = []
			titles = []
			program_list = []
			for row in reader:
				program_list.append(row)
				file_path = os.path.join("text", row["broadcast"], row["file_name"])
				if not os.path.isfile(file_path):
					print("記事ファイルが存在しません！: {}".format(file_path))
					continue

				with open(file_path) as t:
					text = t.read()
					vector = self.__freq_words(text)

					print("ベクトル計算開始： {}".format(file_path))
					vectors.append(self.__calc_vector(vector, 10))
					titles.append(row["title"])

			for vec in vectors:
				print(vec)

			vectors = np.array(vectors)
			# 正規化
			sum_vec = np.sqrt(np.sum(vectors ** 2, axis=1))
			movie_norm_vectors = vectors / sum_vec.reshape((-1, 1))

			for i, v in enumerate(movie_norm_vectors):
				print(f'{titles[i]}: {movie_norm_vectors[i]}')

			similar_indexes = self.__get_similar_indexes(movie_norm_vectors, movie_norm_vectors[0])
			print(similar_indexes)

			for i in range(0, len(titles)):
				program = {
					"id": i + 1,
					"title": titles[i], 
					"vector": movie_norm_vectors[i].tolist(),
					"broadcast_call_sign": program_list[i]["broadcast"],
					"start": program_list[i]["start"],
					"end":  program_list[i]["end"],
					"day_of_week": {
						"monday": program_list[i]["day_of_week"][0] == "o",
						"tuesday": program_list[i]["day_of_week"][1] == "o",
						"wednesday": program_list[i]["day_of_week"][2] == "o",
						"thursday": program_list[i]["day_of_week"][3] == "o",
						"friday": program_list[i]["day_of_week"][4] == "o",
						"saturday": program_list[i]["day_of_week"][5] == "o",
						"sunday": program_list[i]["day_of_week"][6] == "o",
					}
				}
				self.__db.collection("programs").add(program)

if __name__ == "__main__":
	m = ProgramModel("./cc.ja.300.vec")
	m.generate("./input.csv")