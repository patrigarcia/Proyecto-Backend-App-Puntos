const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');

const AnswerController = {
  async create(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'No estás autenticado' });
      }

      const { reply, likes, _idDoubt } = req.body;

      if (!reply || !likes || !_idDoubt) {
        return res
          .status(400)
          .send({ message: 'Debes completar todos los campos' });
      }

      const answer = await Answer.create({
        reply,
        likes: 0,
        _idDoubt,
        _idUser: req.user._id,
      });
      await Doubt.findByIdAndUpdate(_idDoubt, {
        $push: { _idAnswer: answer._id },
      });
      res
        .status(201)
        .send({ message: 'Respuesta creada exitosamente', answer });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Ha ocurrido un problema al crear la respuesta' });
    }
  },

  async getAllAnswers(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'No estás autenticado' });
      }

      const answers = await Answer.find();

      res
        .status(200)
        .send({ message: 'Estás viendo todas las respuestas', answers });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Hubo un problema al obtener las respuestas' });
    }
  },

  async updateAnswer(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'No estás autenticado' });
      }

      const updatedAnswer = await Answer.findOneAndUpdate({}, req.body, {
        new: true,
      });

      if (!updatedAnswer) {
        return res
          .status(404)
          .send({
            message: 'No se encontró ninguna respuesta para actualizar',
          });
      }

      res
        .status(200)
        .send({
          message: 'Respuesta actualizada exitosamente',
          answer: updatedAnswer,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Hubo un problema al actualizar la respuesta' });
    }
  },

  async likeAnswer(req, res) {
    try {
      const { answerId } = req.params;
      const updatedAnswer = await Answer.findByIdAndUpdate(
        answerId,
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (!updatedAnswer) {
        return res.status(404).send({ message: 'No se encontró la respuesta' });
      }

      res
        .status(200)
        .send({
          message: 'Has dado like a la respuesta',
          answer: updatedAnswer,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Hubo un problema al dar like a la respuesta' });
    }
  },

  async dislikeAnswer(req, res) {
    try {
      const { answerId } = req.params;
      const updateAnswer = await Answer.findByIdAndUpdate(
        answerId,
        { $inc: { likes: -1 } },
        { new: false }
      );

      if (!updateAnswer) {
        return res.status(404).send({ message: 'No se encontró la respuesta' });
      }

      res
        .status(200)
        .send({
          message: 'Has dado dislike a la respuesta',
          answer: updateAnswer,
        });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Hubo un problema al dar dislike a la respuesta' });
    }
  },

  async deleteAnswer(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'No estás autenticado' });
      }

      const { answerId } = req.params;

      const deletedAnswer = await Answer.findByIdAndDelete(answerId);

      if (!deletedAnswer) {
        return res
          .status(404)
          .send({ message: 'La respuesta que buscas no existe' });
      }

      res.status(200).send({ message: 'Respuesta eliminada exitosamente' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Hubo un problema al eliminar la respuesta' });
    }
  },
};

module.exports = AnswerController;
