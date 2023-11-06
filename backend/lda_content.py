import numpy as np
import sys
from gensim.corpora.dictionary import Dictionary
from collections import defaultdict
from collections import Counter

print(sys.version)
print(sys.path)

np.random.seed(0)

# LDA（文章を入力すると、トピックを出力してくれる）
class LDAContentRecommender:
	def recommend(self, **kwargs) -> str:
		# 因子数
		factors = 50
		# エポック数
		n_epochs = 30

		# id: ID, topic: トピックリスト, topic_score: トピックごとの
		movie_content = dataset.item_content.copy()

		# 学習
		tag_genre_data = ["トーク", "西川あやの", "砂山敬太郎", "ラジオ"].toList()

		common_dictionary = Dictionary(tag_genre_data)
		# コーパス（単語ごとの出現頻度表）
		common_corpus = [common_dictionary.doc2bow(text) for text in tag_genre_data]

		lda_model = gensim.models.LdaModel(
			common_corpus, id2word=common_dictionary, num_topics=factors, passes=n_epochs
		)
		lda_topics = lda_model[common_corpus]

		movie_topics = []
		movie_topic_scores = []
		for movie_index, lda_topic in enumerate(lda_topics):
			sorted_topics = sorted(lda_topics[movie_index], key=lambda x: -x[1])
			movie_topic, topic_score = sorted_topics[0]
			movie_topics.append(movie_topic)
			movie_topic_scores.append(topic_score)
		movie_content["topic"] = movie_topics
		movie_content["topic_score"] = movie_topic_scores

		# 評価が高い作品を取得
		movielends_train_high_rating = dataset.train[dataset.train.rating >= 4]
		user_evaluated_movies = dataset.train.groupby("user_id").agg({"movie_id": list})["movie_id"].to_dict()

		# 映画ID -> 連番の対応表を作成
		# zip: 複数の引数をDictionaryにまとめる
		# range: 0～引数の数値までのrange型オブジェクトを返す
		movie_id2index = dict(zip(movie_content.movie_id.tolist(), range(len(movie_content))))
		pred_user2items = defaultdict(list)
		for user_id, data in movielends_train_high_rating.groupby("user_id"):
			evaluated_movie_ids = user_evaluated_movies[user_id]
			# ユーザーが直近評価した10件
			movie_ids = data.sorted_values("timestamp")["movie_id"].tolist()[-10:]
			# 映画ID => インデックスへ変換
			movie_indexes = [movie_id2index[id] for id in movie_ids]
			# トピックの出現回数を数える（key: トピック、value:  出現回数）
			topic_counter = Counter([movie_topics[i] for i in movie_indexes])
			# 最頻出のトピック（most_common: 出現回数順に並べたリストを取得）
			frequent_topic = topic_counter.most_common(1)[0][0]
			# トピックに該当する映画を取得
			topic_movies = (
				movie_content[movie_content.topic == frequent_topic]
				.sort_values("topic_score", ascending=False)
				.movie_id.tolist()
			)

			# 結果を保存
			for movie_id in topic_movies:
				if movie_id not in evaluated_movie_ids:
					pred_user2items[user_id].append(movie_id)
				if len(pred_user2items[user_id]) == 10:
					break

		return pred_user2items

if __name__ == "__main__":
	LDAContentRecommender().run_sample()