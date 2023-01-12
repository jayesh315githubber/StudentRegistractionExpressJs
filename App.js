const express = require('express');
const app = express();
const port = 3304
const path = require('path');
const mysql = require("./connection").con
app.use(express.static(__dirname + "/public"))

//routing
app.get('/', (req, resp) => {
    // resp.send("Hello") //html
    resp.sendFile(path.join(__dirname + "/view/index.html"));
})

app.get("/add", (req, resp) => {
    resp.sendFile(path.join(__dirname + "/view/add.html"));

});

app.get("/search", (req, resp) => {
    resp.sendFile(path.join(__dirname + "/view/search.html"));
});

app.get("/update", (req, resp) => {
    resp.sendFile(path.join(__dirname + "/view/update.html"));

});

app.get("/delete", (req, resp) => {
    resp.sendFile(path.join(__dirname + "/view/delete.html"));

});

app.get("/view", (req, resp) => {
    resp.sendFile(path.join(__dirname + "/view/view.html"));

});

app.get("/addstudent", (req, res) => {
    // fetching data from form
    const { name, phone, email, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from student where emailid=? or phoneno=?";
    mysql.query(qry, [email, phone], (err, results) => {

        // console.log(results.affectedRows);
        var flag = false;
        // var mesg = ""

        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.sendFile(path.join(__dirname + "/view/add.html"));
            } else {

                // insert query
                let qry2 = "insert into student values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {

                    if (results.affectedRows > 0) {
                        // res.render("add", { mesg: true })
                        flag=true
                        // mesg = "Data Inserted"
                        res.sendFile(path.join(__dirname + "/view/view.html",{flag:flag}));
                        // res.render("add", flag)
                    }

                    if (err) {
                        throw err;
                    } else {
                        mesg = "Emailid or Phoneno already present!"
                        res.sendFile(path.join(__dirname + "/view/add.html",{flag:flag}));
                    }
                })
            }
        }
    })
});

app.get("/searchstudent", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from student where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from student where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatestudent", (req, res) => {
    // fetch data

    const { phone, name, gender } = req.query;
    let qry = "update student set username=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from student where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});


app.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log("server is running at port %d ", port);
})


