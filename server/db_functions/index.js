var helpers = require('../services/helper');

module.export = getDataArray = (Model, query, feilds, pagination = null, sort = null) => {
    return new Promise((resolve, reject) => {
        Model.find(query, feilds, pagination)
            .sort(sort)
            .exec((err, data) => {
                if (err || !data || data.length == 0) {
                    let response = helpers.showResponse(false, err);
                    return resolve(response);
                }
                let response = helpers.showResponse(true, "data found", data);
                return resolve(response);
            });
    })
}

module.export = getJoinData = async(Model, query, feilds, lookup = null, pagination = null, sortObj = null) => {

    return new Promise(async(resolve, reject) => {
        try {
            let data = await Model.aggregate()
                .lookup(lookup)
                .match(query)
                .sort(sortObj !== null ? sortObj : { _id: 0 })
                .skip(pagination !== null ? pagination.skip : 0)
                .limit(pagination !== null ? pagination.limit : Number.MAX_SAFE_INTEGER)
            if (data.length > 0) {
                return resolve(helpers.showResponse(true, "data found", data));
            } else {
                return resolve(helpers.showResponse(false, NO_DATA));
            }
        } catch (err) {
            return resolve(helpers.showResponse(false, err.message));
        }
    })
}

module.export = getSingleData = (Model, query, feilds) => {
    return new Promise((resolve, reject) => {
        Model.findOne(query, feilds)
            .exec((err, data) => {
                if (err || !data) {
                    let response = helpers.showResponse(false, err);
                    return resolve(response);
                }
                let response = helpers.showResponse(true, "data found", data);
                return resolve(response);
            });
    })
}

module.export = postData = (modalRefrence) => {
    return new Promise((resolve, reject) => {
        modalRefrence.save((err, savedData) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, 'success', savedData);
            return resolve(response);
        });
    })
}

module.export = insertMany = (Model, dataArray) => {
    return new Promise((resolve, reject) => {
        try {
            Model.insertMany(dataArray);
            let response = helpers.showResponse(true, 'success');
            return resolve(response);
        } catch (err) {
            let response = helpers.showResponse(false, err);
            return resolve(response);
        }
    })
}

module.export = updateData = (Model, DataObject, _id) => {
    return new Promise((resolve, reject) => {
        Model.findByIdAndUpdate(_id, { $set: DataObject }, (err, updatedData) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, 'success', updatedData);
            return resolve(response);
        });
    });
}

module.export = updateByQuery = (Model, DataObject, filter) => {
    return new Promise((resolve, reject) => {
        Model.updateMany(filter, { $set: DataObject }, { "multi": true }, (err, updatedData) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, 'success', updatedData);
            return resolve(response);
        });
    });
}

module.export = deleteData = (Model, query) => {
    return new Promise((resolve, reject) => {
        Model.deleteMany(query, (err) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, 'success');
            return resolve(response);
        });
    });
}

module.export = deleteById = (Model, id) => {
    return new Promise((resolve, reject) => {
        Model.findByIdAndRemove(id, (err) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, 'success');
            return resolve(response);
        });
    });
}

module.export = getCount = (Model, query) => {
    return new Promise((resolve, reject) => {
        Model.countDocuments(query, (err, result) => {
            if (err) {
                let response = helpers.showResponse(false, err);
                return resolve(response);
            }
            let response = helpers.showResponse(true, result);
            return resolve(response);
        });
    });
}