
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collections: [
    {
      id: 201,
      name: "Global Payload",
    },
    {
      id: 1,
      name: "vulnsite.site",
      children: [
        {
          id: 101,
          name: "blog.php"
        },
        {
          id: 102,
          name: "news.php"
        },
        {
          id: 103,
          name: "search.php",
          children: [
            {
              id: 2222,
              name: "munchingsites.web",
              children: [
                {
                  id: 20221,
                  name: "comments.php"
                }
              ]
            }
          ]
        },
      ]
    },
  {
    id: 2,
    name: "munchingsites.web",
    children: [
      {
        id: 201,
        name: "comments.php"
      }
    ]
  },
  {
    id: 3,
    name: "logiathing.web",
    children: [

    ]
  }
  ]
};

export const payloadsSlice = createSlice({
  name: "payloads",

  initialState: initialState,

  reducers: {
    setCollections(state, action) {
      state.collections = action.payload;
    },
    updateCollection(state, action) {
      const collection = state.collections.find(c => c.id === action.payload.id);
      if(collection) {
        Object.assign(collection, action.payload);
      }
    }
  }
});

export const { setCollections, updateCollection } = payloadsSlice.actions;

export default payloadsSlice.reducer;
