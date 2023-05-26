
import { HttpData, HttpError } from "../../../lib/http.js";
import { ObjectId } from "../../../lib/mongoose-utils.js";

import { isLoggedIn } from "../../auth/middlewares/auth.middleware.js";
import { Capture } from "../models/capture.model.js";
import { Payload } from "../models/payload.model.js";

export default async function PayloadsController({  }) {
  return {
    "/": [
      isLoggedIn,
      async (req, res, next) => {
        let { page, limit } = req.query;
        
        page = page || 1;
        limit = limit || 100000;

        const query = {
          owner_id: req.user.id,
        };
        const options = {
          page,
          limit,
        };

        try {
          const result = await Payload.paginate(query, options);

          const { docs, ...meta } = result;
          return res.json(HttpData({
            items: [
              {
                domain: "meta",
                data: meta,
              },
              {
                domain: "payload",
                data: docs.map(({ _id: id, name, owner_id, parent_id }) => {
                  return {
                    id,
                    name,
                    owner_id,
                    parent_id,
                  }
                }),
              }
            ]
          }));
        } catch (e) { }

        return next(HttpError(500, "Could not get payloads."));
      },
    ],
    "/get_payload": [
      isLoggedIn,
      async (req, res, next) => {
        const { id } = req.params;
        try {
          const result = await Payload.findOne({
            _id: id,
          });

          if(result) {
            return res.json(HttpData({
              items: [{
                domain: "payload",
                message: "Payload fetched.",
                data: {
                  id: result.id,
                  name: result.name,
                  owner_id: result.owner_id,
                  parent_id: result.parent_id,
                }
              }]
            }));
          }
        } catch (e) { }

        return next(HttpError(500, "Could not get payloads."));
      }
    ],
    "/create_payload": [
      isLoggedIn,
      async (req, res, next) => {
        let { name, parent_id } = req.body;
        let owner_id = req.user.id;

        parent_id = parent_id || null;
        if(parent_id !== null) {
          parent_id = new ObjectId(parent_id);
        }
        
        try {
          const data = {
            name,
            parent_id,
            owner_id,
          };
          const payload = await Payload.create(data);

          if(payload) {
            return res.json(HttpData({
              items: [{
                domain: "payload",
                message: "Payload was created successfully.",
                data: {
                  id: payload.id,
                  ...data,
                },
              }]
            }));
          }
        } catch (e) { }

        return next(HttpError(500, "Could not create the payload."));
      }
    ],
    "/update_payload": [
      isLoggedIn,
      async (req, res, next) => {
        const { id } = req.params;
        let { name } = req.body;

        try {
          const result = await Payload.findOneAndUpdate(
            {
              _id: id,
              owner_id: req.user.id,
            },
            {
              name, 
            },
            { new: true },
          );
          
          if(result) {
            return res.json(HttpData({
              items: [{
                domain: "payload",
                message: "Payload was updated successfully.",
                data: {
                  id: result._id
                },
              }]
            }));
          }
        } catch (e) {
          // console.log(e);
        }

        return next(HttpError(500, "Could not update the payload."));
      }
    ],
    "/delete_payload": [
      isLoggedIn,
      async (req, res, next) => {
        const owner_id = req.user.id;
        const { id } = req.params;

        try {
          const result = await Payload.findOneAndDelete({
            _id: id,
            owner_id,
          });

          if(result) {
            return res.json(HttpData({
              items: [{
                domain: "payload",
                message: "Payload deleted successfully!"
              }]
            }));
          }
        } catch (e) {

        }

        return next(HttpError(500, "Could not delete the payload"));
      }
    ],
    "/get_captures": [
      async (req, res, next) => {
        const { id: payload_id } = req.params;
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 10000;

        try {
          const payload = await Payload.findOne({
            _id: payload_id
          });
          
          if(!payload?.owner_id?.equals(req.user.id)) {
            return next(HttpError(403, "Not authorized to view the captures."));
          }

          const query = {
            payload_id,
          };
          const options = {
            page,
            limit,
          };

          const result = await Capture.paginate(query, options);

          const { docs, ...meta } = result;
          return res.json(HttpData({
            items: [
              {
                domain: "meta",
                data: meta,
              },
              {
                domain: "payload",
                data: docs.map(doc => {
                  return {
                    id: doc.id,
                    payload_id: doc.payload_id,
                    data: doc.data,
                  }
                }),
              }
            ]
          }));
        } catch (e) {

        }

        return next(HttpError(500, "Could not get the captures."));
      }
    ],
    "/create_capture": [
      async (req, res, next) => {
        const { id: payload_id } = req.params;
        let { data } = req.body;
        data = data || {};

        try {
          const capture = await Capture.create({
            payload_id,
            data,
          });

          if(capture) {
            return res.json(HttpData({
              items: [{
                domain: "capture",
                message: "Data Captured",
                
                data: {
                  id: capture._id,
                }
              }]
            }));
          }
        } catch (e) {

        }

        return next(HttpError(500, "Capture could not be created."));
      }
    ],

    "/get_capture": [
      async (req, res, next) => {
        const { id } = req.params;

        try {
          const capture = await Capture.findOne({
            _id: id,
          });
          if(!capture) {
            return next(HttpError(404, "Capture not found."));
          }

          const payload = await Payload.findOne({
            _id: capture.payload_id,
          });
          if(!payload) {
            throw new Error();
          }

          if(!payload.owner_id.equals(req.user.id)) {
            return next(HttpError(403, "Not authorized to get the capture."));
          }

          return res.json(HttpData({
            items: [{
              domain: "capture",
              message: "Capture retrived successfully.",
              data: {
                payload_id: capture.payload_id,
                data: capture.data,
              }
            }]
          }));
        } catch (e) {

        }

        return next(HttpError(500, "Could not get the capture."));
      }
    ],

    "/delete_capture": [
      async (req, res, next) => {
        const { id } = req.params;

        try {
          const capture = await Capture.findOne({
            _id: id,
          });
          if(!capture) {
            return next(HttpError(404, "Capture not found."));
          }

          const payload = await Payload.findOne({
            _id: capture.payload_id,
          });
          if(!payload) {
            throw new Error();
          }

          if(!payload.owner_id.equals(req.user.id)) {
            return next(HttpError(403, "Not authorized to delete the capture."));
          }
          
          await capture.deleteOne();

          if(capture.$isDeleted) {
            return res.json(HttpData({
              items: [{
                domain: "capture",
                message: "Capture deleted successfully."
              }]
            }));
          }
        } catch (e) {

        }

        return next(HttpError(500, "Capture could not be deleted."));
      }
    ]
  }
}
