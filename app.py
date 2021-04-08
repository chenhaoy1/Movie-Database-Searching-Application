from flask import Flask, request
import json 
import requests
app = Flask(__name__)
app.debug = True

@app.route("/", methods=['GET'])
def index():
    return app.send_static_file('index.html')

@app.route("/api", methods=['GET'])
def api():
    
    d = {}
    name = request.args.get("x")
    name = str(name).split()
    category = request.args.get("y")
    URL = 'https://api.themoviedb.org/3/search/' + str(category) + '?api_key=66f34c7cc38ca73cb928c4610df72021&query=' + '+'.join(name) + '&language=en-US&page=1&include_adult=false'
    response = requests.get(URL)
    data = response.json()
    if str(category) == 'movie':
        data = data['results'][:10]
        for i in data:
            del i['adult']
            del i['backdrop_path']
            del i['original_language']
            del i['original_title']
            del i['popularity']
            del i['video']
    elif str(category) == 'tv':
        data = data['results'][:10]
        for i in data:
            del i['backdrop_path']
            del i['origin_country']
            del i['original_language']
            del i['original_name']
            del i['popularity']
    elif str(category) == 'multi':
        res = []
        data = data['results']
        for i in data:
            if i['media_type'] == 'tv':
                del i['backdrop_path']
                del i['origin_country']
                del i['original_language']
                del i['original_name']
                del i['popularity']
                res.append(i)
            elif i['media_type'] == 'movie':
                del i['adult']
                del i['backdrop_path']
                del i['original_language']
                del i['original_title']
                del i['popularity']
                del i['video']
                res.append(i)
            else:
                continue 
            if len(res) == 10:
                break 
        data = res 
    d['Result'] = data 
    return d

@app.route("/tvtrend", methods=['GET'])
def tvtrend():

    d = {}
    
    URL = 'https://api.themoviedb.org/3/tv/airing_today?api_key=66f34c7cc38ca73cb928c4610df72021'
    response = requests.get(URL)
    data = response.json()
    data = data['results'][:5]
    d['result'] = data
    return d

@app.route("/mvtrend", methods=['GET'])
def mvtrend():
    d = {}
    
    URL = 'https://api.themoviedb.org/3/trending/movie/week?api_key=66f34c7cc38ca73cb928c4610df72021'
    response = requests.get(URL)
    data = response.json()
    data = data['results'][:5]
    d['result'] = data
    return d
#@app.route("/server", methods=['GET', 'POST'])
#def server():

@app.route("/mvinfo", methods=['GET'])
def mvdetails():
    res = {}
    d = {}
    id = request.args.get("x")
    URL = 'https://api.themoviedb.org/3/movie/' + str(id) + '?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US'
    response = requests.get(URL)
    data = response.json()
    d["id"] = data["id"]
    d["title"] = data["title"]
    d["runtime"] = data["runtime"]
    d["release_date"] = data["release_date"]
    d["spoken_languages"] = data["spoken_languages"]
    d["vote_average"] = data["vote_average"]
    d["vote_count"] = data["vote_count"]
    d["poster_path"] = data["poster_path"]
    d["backdrop_path"] = data["backdrop_path"]
    d["genres"] = data["genres"]
    res["details"] = d
    URL = 'https://api.themoviedb.org/3/movie/' + str(id) + '/credits?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US'
    response = requests.get(URL)
    data = response.json()
    data = data["cast"][:8]
    for i in data:
        del i["adult"]
        del i["gender"]
        del i["id"]
        del i["known_for_department"]
        del i["original_name"]
        del i["popularity"]
        del i["cast_id"]
        del i["credit_id"]
        del i["order"]
    res["credits"] = data
    URL = 'https://api.themoviedb.org/3/movie/' + str(id) + '/reviews?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US&page=1'
    response = requests.get(URL)
    data = response.json()
    data = data["results"][:5]
    for i in data:
        i["rating"] = i["author_details"]["rating"]
        i["username"] = i["author_details"]["username"]
        del i["author_details"]
        del i["author"]
        del i["id"]
        del i["updated_at"]
        del i["url"]
    res["reviews"] = data
    return res
    
@app.route("/tvinfo", methods=['GET'])
def tvdetails():
    res = {}
    d = {}
    id = request.args.get("x")
    URL = 'https://api.themoviedb.org/3/tv/' + str(id) + '?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US'
    response = requests.get(URL)
    data = response.json()
    d["backdrop_path"] = data["backdrop_path"]
    d["episode_run_time"] = data["episode_run_time"]
    d["first_air_date"] = data["first_air_date"]
    d["genres"] = data["genres"]
    d["id"] = data["id"]
    d["name"] = data["name"]
    d["number_of_seasons"] = data["number_of_seasons"]
    d["overview"] = data["overview"]
    d["poster_path"] = data["poster_path"]
    d["spoken_languages"] = data["spoken_languages"]
    d["vote_average"] = data["vote_average"]
    d["vote_count"] = data["vote_count"]
    res["details"] = d
    URL = 'https://api.themoviedb.org/3/tv/' + str(id) + '/credits?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US'
    response = requests.get(URL)
    data = response.json()
    data = data["cast"][:8]
    for i in data:
        del i["adult"]
        del i["gender"]
        del i["id"]
        del i["known_for_department"]
        del i["original_name"]
        del i["popularity"]
        del i["credit_id"]
        del i["order"]
    res["credits"] = data
    URL = 'https://api.themoviedb.org/3/tv/' + str(id) + '/reviews?api_key=66f34c7cc38ca73cb928c4610df72021&language=en-US&page=1'
    response = requests.get(URL)
    data = response.json()
    data = data["results"][:5]
    for i in data:
        i["rating"] = i["author_details"]["rating"]
        i["username"] = i["author_details"]["username"]
        del i["author_details"]
        del i["author"]
        del i["id"]
        del i["updated_at"]
        del i["url"]
    res["reviews"] = data
    return res

if __name__ == "__main__":
    app.run(debug=True)