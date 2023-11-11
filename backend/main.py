# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from flask import Flask, jsonify, request
import logging
import numpy as np

# import sys
# sys.path.append("/usr/local/lib/python3.11/dist-packages")

initialize_app()
options.set_global_options(region=options.SupportedRegion.ASIA_NORTHEAST1)
app = Flask(__name__)

# ログ設定
logging.basicConfig(
        format = "[%(asctime)s][%(levelname)s] %(message)s",
        level = logging.DEBUG
    )
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# 日本語を扱う
app.config['JSON_AS_ASCII'] = False

@app.get("/widgets")
@app.get("/widgets/<id>")
def get_widget(id=None):
    if id is not None:
        return "ID is set"
    else:
        return "ID is not set"

@app.post("/widgets")
def add_widget():
    new_widget = Flask.request.get_data(as_text=True)
    return Flask.Response(status=201, response="Added Widget")

@app.get("/programs")
def get_programs():
    db = firestore.client()
    programs_ref = db.collection("programs")
    d = []
    mes = programs_ref.get()
    for m in mes:
        d.append(m.to_dict())
    return d

@app.post("/pred/tags")
def pred_tags():
    body = request.json["tags"]
    logger.debug(body)
    json = {
        "name": "おいでよクリエイティ部"
    }
    return jsonify(json)

@app.post("/pred/programs")
def pred_programs():
    program_ids = request.json["program_ids"]
    print("ユーザーが指定した好きな番組ID: {}".format(program_ids))

    # 全番組のコサイン類似度を取得
    db = firestore.client()
    programs_ref = db.collection("programs")
    programs = programs_ref.get()
    ids = []
    vectors = []
    for program in programs:
        p = program.to_dict()
        ids.append(p["id"])
        vectors.append(p["vector"])

    vectors = np.array(vectors)
    # 正規化
    sum_vec = np.sqrt(np.sum(vectors ** 2, axis=1))
    norm_vectors = vectors / sum_vec.reshape((-1, 1))
    
    # 比較元となる番組のコサイン類似度の平均値を取得
    target_vectors = []
    for program_id in program_ids:
        for i, id in enumerate(ids):
            if id == program_id:
                target_vectors.append(vectors[i])

    target_vectors = np.array(target_vectors)
    target = target_vectors.mean(axis=0)

    # print("[target]id:{}, vector:{}, ids: {}, vectors:{}".format(program_ids, target, ids, vectors))
    # 内積（コサイン類似度=内積/ベクトルの大きさ(=1)=内積, -1.0:逆, 0:無関係, 1:似ている）
    score_vec = np.dot(norm_vectors, target)
    # print("score_vec: {}".format(score_vec))
    # print("-score_vec:{}".format(-score_vec))
	# valueの順に決定
    similar_indexes = np.argsort(-score_vec) # TODO:ここで降順にするために「-」をつけたせいで、順序がおかしくなる場合がありそう
    # print("order: {}".format(similar_indexes))
    print("似ている番組ID: {}".format(np.array(ids)[similar_indexes]))
    pred_program_ids = []
    for similar_index in similar_indexes:
        if ids[similar_index] not in program_ids:
            pred_program_ids.append(ids[similar_index])
        if len(pred_program_ids) == 3:
            break

    json = {
        "pred_program_ids": pred_program_ids
    }
    return jsonify(json)

@https_fn.on_request()
def radio_recommend(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()