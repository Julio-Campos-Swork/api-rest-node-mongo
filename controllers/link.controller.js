import { Link } from "../models/Link.js";
import { nanoid } from "nanoid";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid }); //el uid viene del token que se manda a traer antes de ejecutar esta funcion
    return res.status(200).json({ links });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};
export const getLink = async (req, res) => {
    try {
      const { nanoLink } = req.params;
    //   console.log(req)
      const link = await Link.findOne({nanoLink});
  
      if (!link) return res.status(404).json({ error: "El link no existe" });

      console.log(link);
      return res.status(200).json({ longLink: link.longLink });
    } catch (error) {
      console.log(error);
      if (error.kind === "ObjectId") {
        return res.status(403).json({ error: "Formato de ID incorrecto" });
      }
      return res.status(500).json({ error: "Error de servidor" });
    }
  };
//lo utilizamos en un crud tradicional
export const getLinkCrudTradicional = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    //// hacemos validaciones de los usuarios y de los id si pertecene a los reales o si pertecen al que esta autenticado
    // en caso de tener un servidor mas privado
    if (!link) return res.status(404).json({ error: "El link no existe" });

    if (!link.uid.equals(req.uid))
      return res
        .status(401)
        .json({ error: "El id No pertenece al usuario Autenticado" });

    /////

    console.log(link);
    return res.status(200).json({ link });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato de ID incorrecto" });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};
export const createLink = async (req, res) => {
  try {
    let { longLink } = req.body;
    if (!longLink.startsWith("https://")) {
      longLink = "https://" + longLink;
    }

    const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
    // console.log(longLink)
    const newLink = await link.save();
    return res.status(201).json({ newLink });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const removeLink = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await Link.findById(id);

    if (!link) return res.status(404).json({ error: "El link no existe" });

    if (!link.uid.equals(req.uid))
      return res
        .status(401)
        .json({ error: "El id No pertenece al usuario Autenticado" });

    await link.remove();
    console.log(link);
    return res.status(200).json({ link });
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(403).json({ error: "Formato de ID incorrecto" });
    }
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const updateLink = async (req, res) => {
    try {
      const { id } = req.params;
      const {longLink} = req.body;
    //   console.log(longLink)
      if (!longLink.startsWith("https://")) {
      longLink = "https://" + longLink;
    }

      const link = await Link.findById(id);
  
      if (!link) return res.status(404).json({ error: "El link no existe" });
  
      if (!link.uid.equals(req.uid))
        return res
          .status(401)
          .json({ error: "El id No pertenece al usuario Autenticado" });
  
          link.longLink = longLink;
          await link.save();
    //   console.log(link);
      return res.status(200).json({ link });
    } catch (error) {
      console.log(error);
      if (error.kind === "ObjectId") {
        return res.status(403).json({ error: "Formato de ID incorrecto" });
      }
      return res.status(500).json({ error: "Error de servidor" });
    }
  };
