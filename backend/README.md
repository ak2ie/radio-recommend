# ラジオ番組推薦 - バックエンド

## 開発環境構築
### モデル
fastTextのモデルをダウンロードする。
```
https://fasttext.cc/docs/en/pretrained-vectors.html
```

モデルを生成する。
```python
# generate_model.py
## 本番用（以下をコメントアウト）
#os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
#os.environ["GCLOUD_PROJECT"]="my_project"

## ローカル（コメントアウト解除）
os.environ["FIRESTORE_EMULATOR_HOST"]="localhost:8080"
os.environ["GCLOUD_PROJECT"]="my_project"
```

```bash
# 5分くらいかかる
$ python3.11 generate_model.py
```

## 開発
```bash
# 仮想環境利用
$ source venv/bin/activate
```

## デプロイ
```bash
$ pip freeze > requirements.txt

$ firebase deploy --only functions
```