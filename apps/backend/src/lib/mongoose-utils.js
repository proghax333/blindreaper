
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';

export function paginatorPlugin(schema) {
  mongoosePaginate(schema);
  const { paginate } = schema.statics;

  schema.statics.paginate = function (query, options, callback) {
    return new Promise((resolve, reject) => {
      paginate.bind(this)(query, options, (err, result) => {
        if(err) reject(err);
        else resolve(result);
      });
    });
  };
}

export const ObjectId = mongoose.Types.ObjectId;
