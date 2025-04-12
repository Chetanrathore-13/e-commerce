import Address from "../models/address.model.js";

// Create and Save a new Address
export const create = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Address
  const address = new Address({
    user_id: req.body.user_id,
    full_name: req.body.full_name,
    phone: req.body.phone,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    postal_code: req.body.postal_code
  });

  // Save Address in the database
  try {
    const data = await address.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Address."
    });
  }
};

// Retrieve all Addresses from the database.
export const findAll = async (req, res) => {
  try {
    const data = await Address.find();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving addresses."
    });
  }
};

// Find a single Address with an id
export const findOne = async (req, res) => {
  try {
    const data = await Address.findById(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    res.send(data);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Error retrieving Address with id " + req.params.id
    });
  }
};

// Update a Address identified by the id in the request
export const update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Address content can not be empty"
    });
  }

  // Find the address and update it with the request body
  try {
    const data = await Address.findByIdAndUpdate(
      req.params.id,
      {
        user_id: req.body.user_id,
        full_name: req.body.full_name,
        phone: req.body.phone,
        address_line1: req.body.address_line1,
        address_line2: req.body.address_line2,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        postal_code: req.body.postal_code
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    res.send(data);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Error updating Address with id " + req.params.id
    });
  }
};

// Delete a Address with the specified id in the request
export const deleteAddress = async (req, res) => {
  try {
    const data = await Address.findByIdAndRemove(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    res.send({ message: "Address deleted successfully!" });
  } catch (err) {
    if (err.kind === "ObjectId" || err.name === "NotFound") {
      return res.status(404).send({
        message: "Address not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Could not delete Address with id " + req.params.id
    });
  }
};

