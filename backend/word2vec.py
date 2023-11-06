import numpy as np
import pandas as pd
import gensim

np.random.seed(0)

class Word2vecRecommender():
	def recommend(self, selected_programs, **kwargs) -> str:
		"""選択された番組に似ている番組を取得する

		Parameters:
		----------
		self : Object
			operand1 of addition
		selected_programs : int[]
			基になる似ている番組

		Returns:
		----------
		int[]
			似ている番組一覧
		"""
		# 因子数
		factors = kwargs.get("factors", 100)
		# エポック数
		n_epochs = kwargs.get("n_epochs", 30)
		# windowサイズ
		window = kwargs.get("window", 100)
		# スキップグラム
		use_skip_gram = kwargs.get("use_skip_gram", 1)
		# 階層的ソフトマックス
		use_hierarchial_softmax = kwargs.get("use_hierarchial_softmax", 0)
		# 使用する単語の出現回数のしきい値
		min_count = kwargs.get("min_count", 5)

		movie_content = pd.DataFrame([
			[
				1,
				"おとなりさん",
				"あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお"
			],
			[
				2,
				"おいでよ",
				"あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお"
			],
			[
				3,
				"おはようてらちゃん",
				"あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお"
			]
		],colmuns=["program_id", "title", "text"])

		# TODO: テキストを取得

		# word2vec学習
		# （単語をベクトルで表現する。ベクトルにすることで、単語間の類似度を定量化できる。類似度の指標としてコサイン距離を用いる。）
		tag_genre_data = movie_content.text.tolist()
		model = gensim.models.word2vec.Word2Vec(
			tag_genre_data,
			vector_size=factors,
			window=window,
			sg=use_skip_gram,
			hs=use_hierarchial_softmax,
			epochs=n_epochs,
			min_count=min_count
		)

		# TODO: .wv.save_word2vec_format(保存ファイルパス, binary=True)で保存できる

		# 各映画のベクトルを計算する
		movie_vectors=[]
		# .wvはWord2VecKeyedVectorsというオブジェクトで，単語をキー，分散表現を値に持つ辞書
		tag_genre_in_model=set(model.wv.key_to_index.keys())

		titles = []
		ids = []

		for i, tag_genre in enumerate(tag_genre_data):
			# word2vecのモデルで使用可能なタグ・ジャンルに絞る
			input_tag_genre = set(tag_genre) & tag_genre_in_model # 当該番組のタグ（重複排除済）と学習結果で一致するものを取得
			if len(input_tag_genre) == 0:
				# word2vecに基づいてベクトル計算できない映画にはランダムのベクトルを付与
				vector = np.random.randn(model.vector_size)
			else:
				vector = model.wv[input_tag_genre].mean(axis=0)
			titles.append(movie_content.iloc[i]["title"]) # iloc: 行・列番号を指定して取得
			ids.append(movie_content.iloc[i]["movie_id"])
			movie_vectors.append(vector)

		# 後続の類似度計算がし易いように、numpyの配列で保持しておく
		movie_vectors = np.array(movie_vectors)

		# 正規化したベクトル
		sum_vec = np.sqrt(np.sum(movie_vectors ** 2, axis=1))
		movie_norm_vectors = movie_vectors / sum_vec.reshape((-1, 1))

		# 似ているアイテムを取得(ベクトル、除外アイテム、取得数)
		def find_similar_items(vec, evaluated_movie_ids, topn=10):
			# 行列同士の積
			score_vec = np.dot(movie_norm_vectors, vec)
			similar_indexes = np.argsort(-score_vec)

			# 似ているものを取得（除外リストを考慮）
			similar_items = []
			for similar_index in similar_indexes:
				if ids[similar_index] not in evaluated_movie_ids:
					similar_items.append(ids[similar_index])
				if len(similar_items) == topn:
					break
			return similar_items
		
		# movielends_train_high_rating = dataset.train[dataset.train.rating >= 4]
		# user_evaluated_movies = dataset.train.groupby("user_id").agg({"movie_id": list})["movie_id"].to_dict()
		user_evaluated_movies = selected_programs

		id2index = dict(zip(ids, range(len(ids))))
		pred_user2items = dict()
		# for user_id, data in movielends_train_high_rating.groupby("user_id"):
		evaluated_movie_ids = user_evaluated_movies
		# ユーザーが高評価を付けたアイテム
		# movie_ids = data.sort_values("timestamp")["movie_id"].tolist()[-5:]
		movie_ids = selected_programs

		movie_indexes = [id2index[id] for id in movie_ids]
		user_vector = movie_norm_vectors[movie_indexes].mean(axis=0)
		recommend_items = find_similar_items(user_vector, evaluated_movie_ids, topn=10)
		pred_user2items = recommend_items

		return pred_user2items

if __name__ == "__main__":
	Word2vecRecommender().recommend()