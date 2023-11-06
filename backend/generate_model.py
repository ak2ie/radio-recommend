import gensim
import MeCab

# https://fasttext.cc/docs/en/crawl-vectors.html
# model_path = "./cc.ja.300.vec"

# wv = gensim.models.KeyedVectors.load_word2vec_format(model_path)

# match = wv.most_similar("企業", topn=10)

# print(match)

# ------------------------------------------------------------------------------
#	形態素解析
# ------------------------------------------------------------------------------
# wakati = MeCab.Tagger("-Owakati")
# print(wakati.parse("pythonが大好きです").split())

text = '''パーソルプロセス＆テクノロジーは、人・プロセスデザイン・テクノロジーの3つの力によって、お客様の様々なビジネスプロセスを変革に導くことで、「はたらいて、笑おう。」の世界を実現いたします。
少子高齢化による生産労働人口減少という課題に対する解決策は、「はたらく人を増やすこと」と「一人ひとりの生産性を向上させていくこと」のいずれかです。
はたらく意思のある方に積極的に参加いただき、人と仕事の適切なマッチングを通じて社会全体で適材適所を推進していくことに加え、テクノロジーを活用しながら業務のあり方を変えていくことが、今後の「仕事」や「はたらき方」に対し大きな影響をもたらします。
その中で、私たちは、お客様の生産性向上を徹底的に推進することを使命とし、AIやIoTなどのテクノロジーを活用したDXの推進、RPA導入を含めたコンサルティング・アウトソーシングを通じて、抜本的にビジネスプロセスを変革いたします。
私たちは社会問題に正面から向き合い、社会の役に立つ会社でありたい、正解のない課題に対しても失敗を恐れずチャレンジしていきたいと考えています。
パーソルプロセス＆テクノロジーは、お客様から選ばれ続ける企業を目指し、挑戦してまいります。'''

mecabTagger = MeCab.Tagger()
noun_count = {}

# https://note.com/smkt_interview/n/nafebd60ae6bc
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
print(noun_count)

wakati = MeCab.Tagger("-Owakati")
words = wakati.parse(text)

# ------------------------------------------------------------------------------
#	モデル
# ------------------------------------------------------------------------------
model_path = "./cc.ja.300.vec"
model = gensim.models.KeyedVectors.load_word2vec_format(model_path)

print(model["言語"])
print(model["東京"])
