(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-57a80956"],{"02bc":function(e,t,s){"use strict";s("dbe8")},"0658":function(e,t,s){},"318b":function(e,t,s){"use strict";s("0658")},"4ddb":function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"aside",attrs:{id:"aside"}},[s("div",{staticClass:"profile"},[e._m(0),s("div",{staticClass:"p_username"},[s("p",[e._v(" "+e._s(this.$store.state.user.username)+" ")])]),s("div",{staticClass:"details"},[s("p",{staticClass:"p_details"},[s("span",[e._v("Last log in:")]),e._v(" "+e._s(this.$store.state.user.last_log.substring(0,10)+" at "+this.$store.state.user.last_log.substring(11,16))+" ")]),s("p",{staticClass:"p_details"},[s("span",[e._v("From:")]),e._v(" "+e._s(this.$store.state.user.last_ip))])]),s("div",{staticClass:"optionDis"},[s("span",{staticClass:"opTitle"},[e._v("Theme")]),s("div",{staticClass:"switch",attrs:{id:"switch"}},[s("span",{attrs:{id:"swtButtom"},on:{click:function(t){return e.setTheme()}}})])])]),s("div",{attrs:{id:"nav"}},[s("router-link",{staticClass:"option",attrs:{to:"/dashboard"}},[s("div",[s("span",[e._v("Dashboard")])])]),s("router-link",{staticClass:"option",attrs:{to:"/actions"}},[s("div",[s("span",[e._v("Actions")])])]),100==this.$store.state.user.permissions?s("router-link",{staticClass:"option",attrs:{to:"/options"}},[s("div",[s("span",[e._v("Admin's panel")])])]):e._e(),s("router-link",{staticClass:"option",attrs:{to:"/account"}},[s("div",[s("span",[e._v("Account")])])]),s("router-link",{staticClass:"option",attrs:{to:"/about"}},[s("div",[s("span",[e._v("About")])])]),s("div",{staticClass:"option",on:{click:e.logout}},[s("span",[e._v("Log out")])])],1),s("router-view")],1)},n=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"prfimg"},[s("div",{staticClass:"imgbg"},[s("img",{staticClass:"primg",attrs:{src:"/api/profimage",alt:"img"}})])])}],o=s("bc3a"),r=s.n(o),c={name:"asideMenu",methods:{logout:function(){var e=this;r.a.get("/api/logout").then((function(){localStorage.removeItem("beacon"),e.$store.commit("logOut"),e.$router.push("/")})).catch((function(){localStorage.removeItem("beacon"),e.$store.commit("logOut"),e.$router.push("/")}))},setTheme:function(){var e=this;0==this.$store.getters.modeGetter?r.a.get("/api/theme/true").then((function(){var t=document.getElementById("switch");t.style.justifyContent="flex-end",t.style.background="#222831",document.getElementById("swtButtom").style.background="#fff",e.$store.commit("modeSetter")})).catch((function(e){console.log(e)})):r.a.get("/api/theme/false").then((function(){var t=document.getElementById("switch");t.style.justifyContent="flex-start",t.style.background="#fff",document.getElementById("swtButtom").style.background="#222831",e.$store.commit("modeSetter")})).catch((function(e){console.log(e)}))}},created:function(){var e=this;setTimeout((function(){if(document.getElementById("aside").style.color="#fff",0==e.$store.getters.modeGetter){var t=document.getElementById("switch");t.style.justifyContent="flex-start",t.style.background="#fff",document.getElementById("swtButtom").style.background="#222831"}else{var s=document.getElementById("switch");s.style.justifyContent="flex-end",s.style.background="#222831",document.getElementById("swtButtom").style.background="#fff"}}),500)}},i=c,l=(s("02bc"),s("2877")),u=Object(l["a"])(i,a,n,!1,null,null,null);t["a"]=u.exports},c47d:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"aBody"}},[e._m(0),s("div",{staticClass:"pageBody"},[s("div",{attrs:{id:"categories"}},[s("h2",[e._v("Inser categories")]),s("p",[e._v("Currently available categories:")]),s("ul",{attrs:{id:"catList"}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.inpCat,expression:"inpCat"}],attrs:{type:"text",id:"nCatInput"},domProps:{value:e.inpCat},on:{input:function(t){t.target.composing||(e.inpCat=t.target.value)}}}),s("input",{attrs:{type:"button",value:"Add category",id:"addCat"},on:{click:function(t){return e.addCat(e.inpCat)}}})]),s("div",{attrs:{id:"createUser"}},[s("h2",[e._v("Create a new user")]),s("div",{staticClass:"controls"},[s("span",[e._v("Username")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.nUser,expression:"nUser"}],attrs:{type:"text",id:"nUsername"},domProps:{value:e.nUser},on:{input:function(t){t.target.composing||(e.nUser=t.target.value)}}}),s("span",[e._v("Password")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.nPassword,expression:"nPassword"}],attrs:{type:"password",id:"nPassword"},domProps:{value:e.nPassword},on:{input:function(t){t.target.composing||(e.nPassword=t.target.value)}}}),s("span",[e._v("Acces level")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.nAccess,expression:"nAccess"}],attrs:{type:"number",max:"100",id:"nAccess"},domProps:{value:e.nAccess},on:{input:function(t){t.target.composing||(e.nAccess=t.target.value)}}}),s("input",{attrs:{type:"button",value:"Create",id:"userCreate"},on:{click:function(t){return e.newUser(e.nUser,e.nPassword,e.nAccess)}}})])]),s("div",{attrs:{id:"aControl"}},[s("h2",[e._v("Access control")]),s("span",[e._v("Username:")]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.userToFind,expression:"userToFind"}],attrs:{type:"text",id:"acUser"},domProps:{value:e.userToFind},on:{input:function(t){t.target.composing||(e.userToFind=t.target.value)}}}),s("input",{attrs:{type:"button",value:"Find",id:"acFind"},on:{click:function(t){return e.findUser(e.userToFind)}}}),s("div",{attrs:{id:"acFindRes"}},[s("div",{staticClass:"resData"},[s("h3",[e._v("Username: "+e._s(e.foundUser))]),s("p",[e._v("Created: "+e._s(e.created)+" ")]),s("p",[e._v("Acces level: "+e._s(e.access)+" ")]),s("p",[e._v("Last login: "+e._s(e.lastTime)+" form "+e._s(e.lastIP))]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.newAccess,expression:"newAccess"}],attrs:{type:"number",placeholder:"Access level",id:"InputAccess"},domProps:{value:e.newAccess},on:{input:function(t){t.target.composing||(e.newAccess=t.target.value)}}}),s("input",{attrs:{type:"button",value:"Set",id:"setAccess"},on:{click:function(t){return e.setAccess(e.foundUser,e.newAccess)}}}),s("input",{attrs:{type:"button",value:"Delete user",id:"delete"},on:{click:function(t){return e.deleteUser(e.foundUser)}}})]),s("div",{staticClass:"resNoData"},[s("p",{staticClass:"errMessage"},[e._v(e._s(e.errMessage))])])])])]),s("asideMenu")],1)},n=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"header"},[s("h1",[e._v("Options")])])}],o=(s("99af"),s("4ddb")),r=s("bc3a"),c=s.n(r),i={name:"options",title:"Beacon | Options",components:{asideMenu:o["a"]},data:function(){return{userToFind:"",foundUser:"",created:"",access:"",lastIP:"",lastTime:"",newAccess:"",errMessage:"",inpCat:"",nUser:"",nPassword:"",nAccess:""}},mounted:function(){this.loadCat()},methods:{loadCat:function(){c.a.get("/api/cat").then((function(e){var t=e.data.categories,s=document.getElementById("catList");s.innerHTML="";for(var a=0;a<t.length;a++){var n=document.createElement("li");n.innerText=t[a],s.appendChild(n)}})).catch((function(e){console.log(e)}))},findUser:function(e){var t=this;c.a.get("/api/access?user=".concat(e)).then((function(e){if(e.data){t.foundUser=e.data.username,t.created=e.data.created_at,t.access=e.data.permissions,t.lastIP=e.data.last_ip,t.lastTime=e.data.last_log,document.querySelector(".resData").style.display="block";var s=document.querySelector(".errMessage");s.style.background="#00ff0056",s.style.borderBottom="solid 2px #00ff00"}})).catch((function(){document.querySelector(".resNoData").style.display="block",document.querySelector(".resData").style.display="none";var e=document.querySelector(".errMessage");e.style.background="#ff000056",e.style.borderBottom="solid 2px #ff0000",t.errMessage="Not found",setTimeout((function(){document.querySelector(".resNoData").style.display="none"}),5e3)}))},setAccess:function(e,t){var s=this;c.a.post("/api/access?user=".concat(e,"&access=").concat(t)).then((function(e){if(200==e.status){document.querySelector(".resNoData").style.display="block";var t=document.querySelector(".errMessage");t.style.background="#00ff0056",t.style.borderBottom="solid 2px #00ff00",s.errMessage="Access level changed",setTimeout((function(){document.querySelector(".resNoData").style.display="none"}),5e3)}})).catch((function(){document.querySelector(".resNoData").style.display="block";var e=document.querySelector(".errMessage");e.style.background="#ff000056",e.style.borderBottom="solid 2px #ff0000",s.errMessage="Unable to set new access level",setTimeout((function(){document.querySelector(".resNoData").style.display="none"}),5e3)}))},addCat:function(e){var t=this;e.length>4&&c.a.post("/api/cat?ncat=".concat(e)).then((function(e){200==e.status&&t.loadCat()}))},newUser:function(e,t,s){c.a.post("/api/user?name=".concat(e,"&password=").concat(t,"&access=").concat(s)).then((function(e){200==e.status&&(document.getElementById("nUsername").value="",document.getElementById("nPassword").value="",document.getElementById("nAccess").value="")})).catch((function(){document.getElementById("nUsername").style.color="#ff0000",document.getElementById("nPassword").style.color="#ff0000",document.getElementById("nAccess").style.color="#ff0000"}))},deleteUser:function(e){var t=this;c.a.delete("/api/user?user=".concat(e)).then((function(e){if(200==e.status){document.querySelector(".resNoData").style.display="block";var s=document.querySelector(".errMessage");s.style.background="#00ff0056",s.style.borderBottom="solid 2px #00ff00",t.errMessage="User deleted",setTimeout((function(){document.querySelector(".resNoData").style.display="none"}),5e3)}})).catch((function(){document.querySelector(".resNoData").style.display="block";var e=document.querySelector(".errMessage");e.style.background="#ff000056",e.style.borderBottom="solid 2px #ff0000",t.errMessage="Unable to delete the user",setTimeout((function(){document.querySelector(".resNoData").style.display="none"}),5e3)}))}}},l=i,u=(s("318b"),s("2877")),d=Object(u["a"])(l,a,n,!1,null,"1d2e744d",null);t["default"]=d.exports},dbe8:function(e,t,s){}}]);
//# sourceMappingURL=chunk-57a80956.5cf05fb1.js.map