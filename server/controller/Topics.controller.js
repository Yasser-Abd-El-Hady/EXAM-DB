const {
    selectAllTopics,
    insertTopicsRecord,
    updateTopic,
    deleteTopic
  } = require('../quries/Topics');
  
  module.exports.getAllTopics = async (req, res, next) => {
    try {
      const result = await selectAllTopics();
      //if all went well
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  };
  
  module.exports.insertTopicsController = async (req, res, next) => {
    const { topic_name } = req.body;
  
    if (topic_name) {
      try {
        const result = await insertTopicsRecord(topic_name);
        //if all went well
        res.status(201).json({
          success: true,
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'error with req.param',
      });
    }
  };
  
  module.exports.updateTopicRecordController = async (req, res, next) => {
    const { id, topic_name } = req.body;
  
    if (id && topic_name) {
      try {
        const result = await updateTopic(id, topic_name);
        //if all went well
        res.status(201).json({
          success: true,
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'error with req.param',
      });
    }
  };
  
  module.exports.deleteTopicController = async (req, res, next) => {
    const id = req.params.id;
  
    if (id) {
      try {
        const result = await deleteTopic(id);
        //if all went well
        res.status(201).json({
          success: true,
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err,
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'error with req.param',
      });
    }
  };
  