from flask import render_template, request, jsonify
from weather_dashboard import app
from weather_dashboard.model import Location, db


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        data = request.json
        location_id = data.get("location_id")
        location_name = data.get("location_name")
        new_location = Location(id=location_id, name=location_name)
        db_entry = Location.query.get(location_id)
        if db_entry:
            db.session.delete(db_entry)
        db.session.add(new_location)
        db.session.commit()
        return jsonify({'message': 'Location added successfully'}), 201
    else:
        locations = []
        locations = Location.query.all()
        print(locations)
        return render_template("index.html", locations=locations)
