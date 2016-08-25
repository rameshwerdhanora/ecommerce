
/** attribute indexes **/
db.getCollection("attribute").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** attribute_option indexes **/
db.getCollection("attribute_option").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** attribute records **/
db.getCollection("attribute").insert({
  "_id": ObjectId("57bd9957eb288f1b257b23c6"),
  "name": "Size",
  "type": "radio",
  "is_required": 1,
  "post_feed": 1,
  "display_type": "H"
});
db.getCollection("attribute").insert({
  "_id": ObjectId("57bd997eeb288f28067b23c6"),
  "name": "Band Size",
  "type": "radio",
  "is_required": 1,
  "post_feed": 1,
  "display_type": "H"
});
db.getCollection("attribute").insert({
  "_id": ObjectId("57bd99f2eb288f1a257b23c6"),
  "name": "Over Bust",
  "type": "radio",
  "is_required": 1,
  "post_feed": 1,
  "display_type": "V"
});

/** attribute_option records **/
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9aeeeb288f99247b23c6"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "XS"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9af9eb288f9a247b23c6"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "S"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9b06eb288f27067b23c6"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "M"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9b0feb288f99247b23c7"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "L"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9b22eb288f19257b23c6"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "XL"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9b50eb288f9a247b23c7"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "2XL"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9ba2eb288f95317b23c6"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "30"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9baaeb288f28067b23c7"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "32"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9bb2eb288f93247b23c6"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "34"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9bb9eb288f9a247b23c8"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "36"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9bc5eb288f9a247b23ca"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "40"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9bc0eb288f9a247b23c9"),
  "attribute_id": "57bd997eeb288f28067b23c6",
  "value": "38"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9daceb288f99247b23c8"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "A 32-33 "
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9db3eb288f99247b23c9"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "B 33-33 "
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9dc3eb288f28067b23c8"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "C 33-33"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9dd1eb288f27067b23c7"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "D 33-33"
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9ddeeb288f99247b23ca"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "DD 33-33 "
});
db.getCollection("attribute_option").insert({
  "_id": ObjectId("57bd9de6eb288f1b257b23c7"),
  "attribute_id": "57bd99f2eb288f1a257b23c6",
  "value": "E 33-33 "
});
