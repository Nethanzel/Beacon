const myRouter = require("express").Router();
const passport = require("passport");

const containerSchema = require("../models/billModel");
const userSchema = require("../models/usersModel");
const catSchema = require("../models/catsModel");

const fs = require("fs");

myRouter.post("/login", (req, res, next) => {
  passport.authenticate("signin", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.json({ access: false, message: 500 });
    }

    if (!user) {
      return res.json({ access: false, message: 400 });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return res.json({ access: false, message: 500 });
      }

      let nLog = {
        date: new Date(),
        ip: req.ip.substring(7, req.ip.length),
      };

      userSchema.updateOne(
        { _id: user._id },
        { last_log: new Date(), $push: { registry: nLog } },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );

      return res.json({
        access: true,
        user: {
          _id: user._id,
          key: user.password,
          username: user.username,
          last_log: user.last_log,
          last_ip: user.last_ip,
          created: user.created_at,
          registry: user.registry,
          permissions: user.permissions,
          theme: user.theme,
          profImg: {
            type: user.pfImg.type,
            Name: user.pfImg.name,
            updated: user.pfImg.updated,
            _updateIP: user.pfImg._updateIP,
          },
        },
      });
    });
  })(req, res, next);
});

myRouter.get("/test", (req, res) => {
  if (req.isAuthenticated()) {
    res
      .status(200)
      .json({
        message:
          "Your username is " +
          req.user.username +
          ", and you will only read this if you are a valid user.",
      });
  } else {
    res.status(400).json({ message: "If i were you i'd log in first." });
  }
});

myRouter.get("/logout", async (req, res) => {
  await userSchema.updateOne(
    { _id: req.user._id },
    { last_ip: req.ip.substring(7, req.ip.length) },
    (err) => {
      if (err) {
        console.log(err);
        res.clearCookie("connect.sid");
        res.json({ message: "Something went not so good, but we're okay!" });
      } else {
        res.clearCookie("connect.sid");
        res.json({ message: "Done!" });
      }
    }
  );

  //req.logOut
  //delete req.user
  req.session.destroy();
});

myRouter.post("/profimage", (req, res) => {
  if (req.isAuthenticated()) {
    let { name, path, type } = req.files.file;

    var ext = name.indexOf(".");
    var fileRoute =
      __dirname.replace("routes", "") +
      "img/profile/" +
      req.user.id +
      name.substring(ext, name.length);

    var imgData = {
      type: type,
      rName: name,
      savedName: req.user.id + name.substring(ext, name.length),
      updated: new Date(),
      _updateIP: req.ip.substring(7, req.ip.length),
    };

    fs.writeFileSync(fileRoute, fs.readFileSync(path));

    userSchema.updateOne(
      { _id: req.user._id },
      { pfImg: imgData },
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    res.status(200).send();
  } else {
    res.status(400).json({ message: "failed" });
  }
});

myRouter.get("/profimage", (req, res) => {
  if (req.isAuthenticated()) {
    var imgRoute = __dirname.replace("routes", "") + "img/profile/";

    res.writeHead(200, { "content-type": req.user.pfImg.type });
    fs.createReadStream(imgRoute + req.user.pfImg.savedName).pipe(res);
  } else {
    res.json({ message: "Denied" });
  }
});

myRouter.get("/theme/:val", (req, res, next) => {
  if (req.isAuthenticated()) {
    userSchema.updateOne({ _id: req.user._id }, { theme: req.params.val }, function (err) {
        if (err) {
          console.log(err);
        }
      });
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

myRouter.post("/billing", async (req, res) => {
  if (req.isAuthenticated()) {
    //Data pre processing before saving to database
    let nBill = req.fields;

    nBill.rUser = req.user.username;
    nBill.rDate = new Date();

    let relFileName,
      fileRoute,
      name,
      path = "";

    if (req.files.bView) {
      name = req.files.bView.name;
      path = req.files.bView.path;

      let ext = name.indexOf(".");
      relFileName = "/billing/" + Date.now() + name.substring(ext, name.length);
      fileRoute = __dirname.replace("routes", "") + "public" + relFileName;
    } else {
      relFileName = "/billing/" + "no-preview.png";
      fileRoute = __dirname.replace("routes", "") + "public" + relFileName;
    }

    nBill.bView = relFileName;

    let bDate = nBill.fecha;
    let objNameSel = new Date(bDate).getFullYear();

    // Validaton data
    let validation = dataValidation(nBill);

    if (!validation.res) {
      return res.status(200).json({ validation });
    }

    if (nBill.consumo == "No") {
      nBill.consumo = false;
    } else {
      nBill.consumo = true;
    }
    //End of data pre processing <> Starting to save to db

    let g0tContainer = await containerSchema.findOne({ selector: objNameSel });

    if (g0tContainer) {
      //Validate if there already is a register with nBill.nfc value
      for (reg of g0tContainer.data) {
        if (reg.ncf == nBill.ncf) {
          let validation = {};
          validation.ncfMsg = "invalid";
          validation.res = false;
          validation.message = "Registered NFC";

          return res.status(200).json({ validation });
        }
      }

      containerSchema.updateOne(
        { selector: objNameSel },
        { $push: { data: nBill } },
        function (err) {
          if (err) {
            console.log(err);
          } else {
            if (req.files.bView) {
              fs.writeFileSync(fileRoute, fs.readFileSync(path));
            }
          }
        }
      );
    } else {
      let nConta = new containerSchema({ selector: objNameSel, data: [nBill] });

      nConta.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          if (req.files.bView) {
            fs.writeFileSync(fileRoute, fs.readFileSync(path));
          }
        }
      });
    }

    res.status(200).json({ validation: { message: "done", res: true } });
  } else {
    res.status(400).json({ "": "" });
  }
});

myRouter.get("/billing", async (req, res) => {
  if (req.isAuthenticated()) {
    let queryParams = req.query;

    if (queryParams.Consumo == "No") {
      queryParams.Consumo = false;
    } else if (queryParams.Consumo == "Yes") {
      queryParams.Consumo = true;
    } else {
      queryParams.Consumo = undefined;
    }

    let validationRes = queryValidation(queryParams);

    if (!validationRes.res) {
      return res.status(200).json(validationRes);
    } else {
      //From here the request has passed all the validation proccess... Keep in mind to filter the Consumo and Category
      //those fields aren't defined in the reqest if the user didn't chose any option, that means you don't have to take
      //em on count

      let queryYear;
      let queryMonth;
      let queryDay;

      if (queryParams.Date) {
        queryYear = new Date(queryParams.Date).getFullYear();
        queryMonth = parseInt(new Date(queryParams.Date).getMonth()) + 1;
        queryDay = new Date(queryParams.Date).getDate();
      } else {
        queryYear = queryParams.Year;
        queryMonth = queryParams.Month;
      }
      //Load the required data filterring the year
      let container;

      if (queryYear) {
        container = await containerSchema.findOne({ selector: queryYear });
      } else {
        return res
          .status(200)
          .json({ res: false, yearMsg: "invalid", fechMsg: "invalid" });
      }
      //If container is null handle here
      let data;

      if (container != null) {
        data = container.data;
      } else {
        return res.status(200).json({ res: true, data: "*" });
      }

      // Filter if there is a month defined in query params
      if (queryMonth) {
        for (let x = data.length - 1; x > -1; x--) {
          let dataMonth = parseInt(new Date(data[x].fecha).getMonth());

          if (parseInt(queryMonth) !== dataMonth + 1) {
            data.splice(x, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Filter if there is a day defined
      if (queryDay) {
        for (let i = data.length - 1; i > -1; i--) {
          let datDay = new Date(data[i].fecha).getDate();

          if (queryDay !== datDay) {
            data.splice(i, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Filter for RNC
      if (queryParams.RNC) {
        for (let i = data.length - 1; i > -1; i--) {
          if (queryParams.RNC !== data[i].rnc) {
            data.splice(i, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Filter for NCF
      if (queryParams.NCF) {
        for (let i = data.length - 1; i > -1; i--) {
          if (queryParams.NCF !== data[i].ncf) {
            data.splice(i, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Filter for categories
      if (queryParams.Category) {
        for (let i = data.length - 1; i > -1; i--) {
          if (queryParams.Category !== data[i].category) {
            data.splice(i, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Filter by consumo
      if (queryParams.Consumo != undefined) {
        for (let i = data.length - 1; i > -1; i--) {
          if (queryParams.Consumo != data[i].consumo) {
            data.splice(i, 1);
          }
        }
      }
      if (data.length == 0) {
        return res.status(200).json({ res: true, data: "*" });
      } //if not results,
      //breaks the flow and responds the client

      //Finally returns the result to the client
      return res.status(200).json({ res: true, data: data });
    }
  } else {
    res.status(400).json({ "": "" });
  }
});

myRouter.delete("/billing", async (req, res) => {
  if (req.isAuthenticated() && req.user.permissions == 100) {
    let { year, ncf } = req.query;
    let container = await containerSchema.findOne({ selector: year });
    let data = [];

    data = container.data;

    let x;
    for (let i = 0; i < data.length; i++) {
      if (data[i].ncf == ncf) {
        x = data.splice(i, 1);
      }
    }

    let billingImgRoute = __dirname.replace("routes", "public") + x[0].bView;

    if(String(x[0].bView).slice(String(x[0].bView).lastIndexOf("/") + 1, String(x[0].bView).length) != "no-preview.png") {
      if(fs.existsSync(billingImgRoute)) {
        fs.unlinkSync(billingImgRoute);
      }
    }

    containerSchema.updateOne({ selector: year }, { data: data }, (err) => {
      if (err) {
        console.log(err);
        res.status(400).json({ "": "" });
      } else {
        res.status(200).json({ "": "" });
      }
    });
  } else {
    res.status(400).json({ "": "" });
  }
});

myRouter.get("/cat", async (req, res) => {
  if (req.isAuthenticated()) {
    let contSch = await catSchema.findOne({ selector: "catgs" });

    let cats = contSch.categories;

    res.status(200).json({ categories: cats });
  } else {
    res.status(400).json({ "": "" });
  }
});

myRouter.post("/cat", async (req, res) => {
  if (req.isAuthenticated() && req.user.permissions == 100) {
    catSchema.updateOne({ selector: "catgs" }, { $push: {categories: req.query.ncat} }, function (err) {
        if (err) {
          console.log(err);
          return res.status(400).send();
        } else res.status(200).send();
      }
    );

  } else {
    res.status(400).send();
  }

});

myRouter.get("/dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    let allData = await containerSchema.find();
    res.status(200).json(allData);
  } else {
    res.status(400).json({ message: "Auth required" });
  }
});

myRouter.post("/pass", async (req, res) => {
  if (req.isAuthenticated()) {
    let dbUser = await userSchema.findOne({ username: req.user.username });

    if (req.fields.newPassword.length < 5) {
      res.status(202).json({ "": "" });
    } else if (req.fields.currPassword == dbUser.password) {
      dbUser.password = req.fields.newPassword;
      dbUser.meta.passUpd = new Date();

      await dbUser.save({}, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ "": "" });
        } else {
          res.status(200).json({ "": "" });
        }
      });
    } else {
      res.status(400).json({ "": "" });
    }
  } else {
    res.status(400).json({ "": "" });
  }
});

// 

myRouter.get("/access", async (req, res) => {
  if (req.isAuthenticated() && req.user.permissions == 100) {
    let { user } = req.query;
    let reqUser = await userSchema.findOne({username: user});

    if(reqUser) {
      delete reqUser.password;
      res.status(200).json(reqUser)
    } else {
      res.status(400).send()
    }
  } else res.status(400).send();

});

myRouter.post("/access", async (req, res) => {
  if (req.isAuthenticated() && req.user.permissions == 100) {
    userSchema.updateOne({username: req.query.user}, {permissions: req.query.access}, (err) => {
      if(err) {
        res.status(400).send();
      } else res.status(200).send();
    })
  } else res.status(400).send();
});

myRouter.post("/user", async (req, res) => {
  let { name, password, access } = req.query;

  if (req.isAuthenticated() && req.user.permissions == 100) {

    if(name && password && access) {
      let User = await userSchema.findOne({username: name});

      if(!User) {
        let nUser =  new  userSchema({
          username: req.query.name,
          password: req.query.password,
          permissions: req.query.access,
        });

        nUser.save( function (err) {
          if (err) {
            res.status(400).send();
          } else res.status(200).send();
        });
      } else res.status(400).send();

    } else res.status(400).send();

  } else res.status(400).send();
});

myRouter.delete("/user", async (req, res) => {

  let { user } = req.query;
  console.log(req.query, user);
  if(user) {
    userSchema.remove({username: user}, (err) => {
      if(err) {
        
        res.status(400).send();
      } else res.status(200).send();
    })
  } else res.status(400).send();

});

function dataValidation(data) {
  let result = { res: true };

  if (data) {
    if (data.rnc == null || undefined || data.rnc.length !== 9) {
      result.rncMsg = "invalid";
      result.res = false;
    }

    if (data.fecha.length > 19) {
      result.fechMsg = "invalid";
      result.res = false;
    }

    if (data.r_social.length < 3) {
      result.rsMsg = "invalid";
      result.res = false;
    }

    if (data.ncf.length !== 11) {
      result.ncfMsg = "invalid";
      result.res = false;
    }

    if (data.t_grabado < 1 || data.t_grabado.length == 0) {
      result.tgMsg = "invalid";
      result.res = false;
    }

    if (data.t_facturado < 1 || data.t_facturado.length == 0) {
      result.tfMsg = "invalid";
      result.res = false;
    }

    if (data.category == "Categories...") {
      result.catMsg = "invalid";
      result.res = false;
    }

    if (data.consumo == undefined) {
      result.consMsg = "invalid";
      result.res = false;
    }
  } else {
    result.data = "invalid";
    result.res = false;
    return result;
  }
  return result;
}

function queryValidation(data) {
  let result = { res: true };

  if (data) {
    if (data.RNC) {
      if (data.RNC == null || undefined || data.RNC.length !== 9) {
        result.rncMsg = "invalid";
        result.res = false;
      }
    }

    if (data.Date) {
      if (data.Date.length > 19) {
        result.fechMsg = "invalid";
        result.res = false;
      }
    }

    if (data.Year) {
      if (data.Year.length !== 4) {
        result.yearMsg = "invalid";
        result.res = false;
      }
    }

    if (data.Month) {
      if (data.Month > 12) {
        result.monthMsg = "invalid";
        result.res = false;
      }
    }

    if (data.NCF) {
      if (data.NCF.length !== 11) {
        result.ncfMsg = "invalid";
        result.res = false;
      }
    }
  } else {
    result.res = false;
    return result;
  }
  return result;
}

module.exports = myRouter;
