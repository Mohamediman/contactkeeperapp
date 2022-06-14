const User = require("../models/User");
const Contact = require("../models/Contact");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllContacts = catchAsync(async (req, res, next) => {
  let contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
  if (!contacts) {
    return next(new AppError("No contacts found", 404));
  }
  res.status(200).json({ contacts });
});

exports.addContact = catchAsync(async (req, res, next) => {
  const { name, email, phone, type } = req.body;

  const newContact = new Contact({
    name,
    email,
    phone,
    type,
    user: req.user.id,
  });
  const contact = await newContact.save();
  res.status(200).json({
    status: "success",
    contact,
  });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  //===== get the inputs from the user
  const { name, email, phone, type } = req.body;

  //==== build the new Contact Object from the user input
  const newContact = {};
  if (name) newContact.name = name;
  if (email) newContact.email = email;
  if (phone) newContact.phone = phone;
  if (type) newContact.type = type;

  //====Check if the contact is there
  let contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError("No contact Found.", 404));
  }

  //===== Check if the user owns the contact before updating it
  if (contact.user.toString() !== req.user.id) {
    return next(new AppError("Not Authorized to Update", 401));
  }

  //==== Save the updated Contact
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: newContact },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    updatedContact,
  });
});

exports.deleteContact = catchAsync(async (req, res) => {
  //====Check if the contact is there
  let contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError("No contact Found.", 404));
  }

  //===== Check if the user owns the contact before updating it
  if (contact.user.toString() !== req.user.id)
    return res.status(401).json({ msg: "Not Authorized to Update" });

  //==== Save the updated Contact
  await Contact.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: "success",
    msg: "Contact removed...",
  });
});
