// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat

import { Cat } from "../../interfaces/Cat";
import catModel from "../models/catModel";
import userModel from "../models/userModel";

export default {
    Query: {
      cats: async () => {
        return await catModel.find();
      },
      catById: async (_: undefined, args: {id: string}) => {
        return await catModel.findById(args.id);
      },
      catsByOwner: async (_: undefined, args: {owner: string}) => {
        return await catModel.find({owner: args.owner});
      },
      catsByArea: async (_: undefined, args: {area: string}) => {
        return await catModel.find({area: args.area});
      },
    },
    Mutation: {
      createCat: async (_: undefined, args: Cat) => {
        const cat = new catModel(args);
  
        const owner = await userModel.findById(args.owner);
        if (!owner) {
          throw new Error('No owner found');
        }
        cat.owner = owner;
        await cat.save();
        return cat;
      },
      updateCat: async (_: undefined, args: Cat) => {
        const cat = await catModel.findByIdAndUpdate(
          args.id,
          {...args},
          {
            new: true,
          }
        );
        return cat;
      },
      deleteCat: async (_: undefined, args: Cat) => {
        return catModel.findOneAndDelete({_id: args.id});
      },
    },
  };