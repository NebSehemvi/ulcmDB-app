let express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/ulcm_nodes");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

var nodeSchema = new mongoose.Schema({
    node_id: Number,
    name: String,
    city: String,
    address: String,
    descr: String,
    contacts: {
        full_name: String,
        t_number: String,
        email: String,
        company: String,
        position: String,
        city: String,
        address: String
    },
    equip: {
        ip: String,
        name: String,
        dns1: String,
        dns2: String,
        mask: String,
        gw: String
    }
});

var Node = mongoose.model("Node", nodeSchema);

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/nodes", function(req, res){
    Node.find({}, function(err, nodes){
        if(err){
            console.log("Some error occured: " + err);
        } else {
            res.render("node", {data: nodes})
        }
    });
});

app.post("/nodes", function(req, res){
    if(req.body.descr == "") {
        var descr = "—";
    } else {
        var descr = req.body.descr;
    }
    Node.find({}).limit(1).sort({node_id: -1}).exec(function(err, node){
        var id = node[0].node_id + 1;
        if (err) {
            console.log(err);
        } else {
            let newNode = {
                node_id: id,
                name: req.body.name, 
                city: req.body.city,
                address: req.body.address,
                descr: descr,
                contacts: {
                    full_name: req.body.full_name,
                    t_number: req.body.t_number,
                    company: req.body.company,
                    email: req.body.email,
                    position: req.body.position,
                    city: req.body.cont_city,
                    address: req.body.cont_address
                },
                equip: {
                    ip: req.body.ip,
                    name: req.body.eq_name,
                    dns1: req.body.dns1,
                    dns2: req.body.dns2,
                    mask: req.body.mask,
                    gw: req.body.gw
                }
            };
            
            Node.create(newNode, function(err, node){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Node '" + req.body.name + "'" + " has been added");
                }
            });
        }
    });

    res.redirect("/nodes");
});

app.get("/edit/:id", function(req, res) {
  let id = req.params.id;
  Node.find({"node_id": id}, function(err, node){
        if(err || node == false){
            console.log("404: Page not found");
            res.render("404");
        } else {
            res.render("edit", {data: node[0]});
        }
  });
});

app.post("/edit/:id", function(req, res) {
    let id = req.params.id;
    if(req.body.descr == "") {
        var descr = "—";
    } else {
        var descr = req.body.descr;
    }
    let updatedNode = {
        node_id: id,
        name: req.body.name, 
        city: req.body.city,
        address: req.body.address,
        descr: descr,
        contacts: {
            full_name: req.body.full_name,
            t_number: req.body.t_number,
            company: req.body.company,
            email: req.body.email,
            position: req.body.position,
            city: req.body.cont_city,
            address: req.body.cont_address
        },
        equip: {
            ip: req.body.ip,
            name: req.body.eq_name,
            dns1: req.body.dns1,
            dns2: req.body.dns2,
            mask: req.body.mask,
            gw: req.body.gw
        }
    };
    Node.update({node_id: id}, updatedNode, function(err, node){
        if(err) {
            console.log(err);
        }
    res.redirect("/nodes");
    });
});

app.post("/delete/:id", function(req, res) {
    let id = req.params.id;
    Node.remove({node_id:id}, function(err){
        if (err){
            console.log(err);
        } else {
            console.log("Entry with id " + id + " has been deleted")
            res.redirect("/nodes"); 
        }
    })
});

app.get("/nodes/new", function(req, res){
    res.render("new");
});

app.get("/details/:id", function(req, res) {
   let id = req.params.id;
   Node.find({node_id:id}, function(err, node){
       if (err || node == false) {
           console.log(err);
           res.render("404");
       } else {
           res.render("details", {data: node[0]});
       }
   });
});

app.get("*", function(req, res){
   res.render("404");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is on!");
});