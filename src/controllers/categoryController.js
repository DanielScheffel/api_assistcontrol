import { categoryModel, deleteCategoryModel } from "../models/categoryModel.js";


export async function categoryController( req, res) {
    const { categoria } = req.body;

    const result = await categoryModel(categoria);

    return res.status(201).json(result);
}


export async function deleteCategoryController(req, res) {
    const { categoryID } = req.params;

    const result = await deleteCategoryModel(categoryID);

    return res.status(200).json(result);
}