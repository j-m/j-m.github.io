function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var dist = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var OatyArray = /** @class */ (function () {
    function OatyArray(_data, _options) {
        if (_data === void 0) { _data = []; }
        if (_options === void 0) { _options = {}; }
        this._data = _data;
        this._options = _options;
        this._transposed = {};
        this.transpose(_data);
    }
    Object.defineProperty(OatyArray.prototype, "keys", {
        get: function () {
            return this._options.keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OatyArray.prototype, "length", {
        get: function () {
            return this._data.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OatyArray.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OatyArray.prototype, "transposed", {
        get: function () {
            return this._transposed;
        },
        enumerable: true,
        configurable: true
    });
    OatyArray.prototype.get = function (keyName, keyValue) {
        if (this._transposed[keyName] === undefined) {
            throw new ReferenceError("The key '" + keyName + "' has not been transposed");
        }
        if (keyValue === undefined) {
            return this._transposed[keyName];
        }
        return this._transposed[keyName][keyValue];
    };
    OatyArray.prototype.push = function () {
        var _a;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        this.transpose(data);
        return (_a = this._data).push.apply(_a, data);
    };
    OatyArray.prototype.transpose = function (data) {
        var _a;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var datum = data_1[_i];
            for (var _b = 0, _c = (this.keys || Object.keys(datum)); _b < _c.length; _b++) {
                var key = _c[_b];
                if (datum[key] === undefined) {
                    continue;
                }
                if (this._transposed[key] === undefined) {
                    this._transposed[key] = (_a = {}, _a[datum[key]] = [datum], _a);
                    continue;
                }
                if (this._transposed[key][datum[key]] === undefined) {
                    this._transposed[key][datum[key]] = [datum];
                    continue;
                }
                this._transposed[key][datum[key]].push(datum);
            }
        }
    };
    return OatyArray;
}());
exports.OatyArray = OatyArray;
});

var Tagable_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var Tagable = (function () {
    function Tagable(data) {
        if (data === void 0) { data = {}; }
        this._tags = data.tags || {};
        this._resources = data.resources || {};
        this._tagged = new dist.OatyArray(data.tagged);
    }
    Object.defineProperty(Tagable.prototype, "resources", {
        get: function () {
            return this._resources;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tagable.prototype, "tagged", {
        get: function () {
            return this._tagged.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tagable.prototype, "tags", {
        get: function () {
            return this._tags;
        },
        enumerable: true,
        configurable: true
    });
    Tagable.prototype.import = function (data) {
        var _a;
        Object.assign(this._tags, data.tags);
        Object.assign(this._resources, data.resources);
        (_a = this._tagged).push.apply(_a, data.tagged || []);
    };
    Tagable.prototype.export = function () {
        return JSON.stringify({
            resources: this.resources,
            tagged: this.tagged,
            tags: this.tags
        });
    };
    Tagable.prototype.addResource = function (resourceID, resource) {
        if (this._resources[resourceID]) {
            throw Error("Resource ID '" + resourceID + "' is already in use");
        }
        this._resources[resourceID] = resource;
    };
    Tagable.prototype.addTag = function (tagID, tag) {
        if (this._tags[tagID]) {
            throw Error("Tag ID '" + tagID + "' is already in use");
        }
        this._tags[tagID] = tag;
    };
    Tagable.prototype.tagResource = function (tagged) {
        if (this._resources[tagged.resourceID] === undefined) {
            throw ReferenceError("Unknown resource '" + tagged.resourceID + "'");
        }
        if (this._tags[tagged.tagID] === undefined) {
            throw ReferenceError("Unknown tag '" + tagged.tagID + "'");
        }
        this._tagged.push(tagged);
    };
    Tagable.prototype.getTags = function (resourceID) {
        var _this = this;
        if (this._resources[resourceID] === undefined) {
            throw ReferenceError("Unknown resource '" + resourceID + "'");
        }
        var tagged = this._tagged.get('resourceID', resourceID);
        if (tagged === undefined) {
            return {};
        }
        var result = {};
        tagged.forEach(function (tag) { result[tag.tagID] = _this._tags[tag.tagID]; });
        return result;
    };
    Tagable.prototype.getResources = function (tagID) {
        var _this = this;
        if (this._tags[tagID] === undefined) {
            throw ReferenceError("Unknown tag '" + tagID + "'");
        }
        var tagged = this._tagged.get('tagID', tagID);
        if (tagged === undefined) {
            return {};
        }
        var result = {};
        tagged.forEach(function (tag) { result[tag.resourceID] = _this._resources[tag.resourceID]; });
        return result;
    };
    return Tagable;
}());
exports.Tagable = Tagable;

});

var Tagable = /*@__PURE__*/unwrapExports(Tagable_1);

const tags={actionscript2:{parent:"language",data:{title:"ActionScript2"}},angular:{data:{title:"Angular"}},api:{children:["rest","graphql"],data:{title:"API"}},c:{parent:"language",data:{title:"C"}},cpp:{parent:"language",data:{title:"C++"}},coursework:{data:{title:"Coursework",description:"All work relating to coursework from university, sixth form, or otherwise."}},csharp:{parent:"language",data:{title:"C#"}},delphi:{parent:"language",data:{title:"Delphi Pascal"}},graphql:{parent:"api",data:{title:"GraphQL"}},hackathon:{children:["winner"],data:{title:"Hackathon"}},javascript:{parent:"language",data:{title:"JavaScript"}},mongo:{data:{title:"Mongo"}},npm:{data:{title:"NPM",description:"Node Package Manager. These are the npm projects that I have contributed to or publish myself."}},language:{children:["actionscript2","c","csharp","cpp","delphi","javascript","typescript"],data:{title:"Programming Language",description:"The children of this tag are the various programming languages I have used over the years."}},react:{data:{title:"ReactNative"}},rest:{parent:"api",data:{title:"REST"}},game:{data:{title:"Game"}},svelte:{data:{title:"Svelte"}},svg:{data:{title:"SVG"}},typescript:{parent:"language",data:{title:"TypeScript"}},website:{parent:"hackathon",data:{title:"Website"}},winner:{data:{title:"Winner",description:"This project received an award at a hackathon."}}};const tagged=[{resourceID:"tagable",tagID:"npm"},{resourceID:"210CT",tagID:"cpp"},{resourceID:"TourOfBritain",tagID:"mongo"},{resourceID:"TourOfBritain",tagID:"angular"},{resourceID:"JonHash",tagID:"c"},{resourceID:"JonHash",tagID:"cpp"},{resourceID:"JonHash",tagID:"coursework"},{resourceID:"jonmarshdev",tagID:"svelte"},{resourceID:"jonmarshdev",tagID:"website"},{resourceID:"Oaty",tagID:"typescript"},{resourceID:"Browsability",tagID:"javascript"},{resourceID:"Browsability",tagID:"rest"},{resourceID:"FaktNews",tagID:"javascript"},{resourceID:"FaktNews",tagID:"rest"},{resourceID:"FaktNews",tagID:"svg"},{resourceID:"FaktNews",tagID:"winner"},{resourceID:"PulfrichBird",tagID:"javascript"},{resourceID:"PulfrichBird",tagID:"game"},{resourceID:"PulfrichBird",tagID:"winner"},{resourceID:"DLE",tagID:"javascript"},{resourceID:"Widgets",tagID:"javascript"},{resourceID:"Widgets",tagID:"svg"},{resourceID:"TNA",tagID:"javascript"},{resourceID:"FaceSwap",tagID:"javascript"},{resourceID:"BSQuiz",tagID:"actionscript2"},{resourceID:"Adventure",tagID:"actionscript2"},{resourceID:"Adventure",tagID:"game"},{resourceID:"AsteroidRun",tagID:"actionscript2"},{resourceID:"AsteroidRun",tagID:"game"},{resourceID:"RWP",tagID:"javascript"},{resourceID:"RWP",tagID:"react"},{resourceID:"RWP",tagID:"coursework"},{resourceID:"TankTrouble",tagID:"delphi"},{resourceID:"TankTrouble",tagID:"coursework"},{resourceID:"TankTrouble",tagID:"game"},{resourceID:"Minesweeper",tagID:"delphi"},{resourceID:"Minesweeper",tagID:"coursework"},{resourceID:"Minesweeper",tagID:"game"},{resourceID:"Encrypt",tagID:"delphi"},{resourceID:"Encrypt",tagID:"coursework"},{resourceID:"Maze",tagID:"csharp"},{resourceID:"Maze",tagID:"game"}];const resources={tagable:{caption:"<img alt='GitHub commit activity' src='https://badgen.net/github/last-commit/j-m/tagable'/>",date:"",description:"A simple platform to tag abstracted resources with a hierarchy structure.",links:{github:"https://github.com/j-m/tagable"},logo:"./images/logos/tagable.png",preview:"",title:"Tagable"},"210CT":{caption:"",date:"",description:"Programming, Algorithms, and Data Structures. console application. 13 complex tasks e.g. N-Queen Problem, Hamiltonian Paths, and string edit distance.C++ templates which automatically detected the data type of user input. I also sanitised, type checked, and error checked their input. ",logo:"",preview:"",title:"210CT"},TourOfBritain:{caption:"",date:"",description:"My first MEAN stack application.",logo:"",preview:"",title:"TourOfBritain"},JonHash:{caption:"",date:"2018-05-02",description:"One part of module from second year at university was to design my own hashing algorithm. I am in the process of converting it to C from C++.",links:{readMore:{type:"html-url",url:"https://raw.githubusercontent.com/j-m/jonhash/master/docs/demo.html"},github:"https://github.com/j-m/jonhash"},logo:"",preview:"./images/previews/jonhash.gif",title:"Jon Hash"},jonmarshdev:{caption:"",date:"2019-06-04",description:"This website! Completely redesigned and overhauled to use Svelte 3.",links:{github:"https://github.com/j-m/jonmarsh.dev"},logo:"",preview:"./images/favicon/android-chrome-512x512.png",title:"jonmarsh.dev"},Oaty:{caption:"",date:"2019-05-02",description:"Get objects from an array in O(1) time. Achieved by transposing the array using the keys of each object. Uses a lot of memory.",links:{github:"https://github.com/jmsv/oaty"},logo:"./images/logos/oaty.jpg",preview:"",title:"Oaty"},Browsability:{caption:"",date:"2018-02-24",description:"A browser compatibility analyser. Scans your repositories for any CSS, HTML, and JavaScript and figures out the minimum version each browser supports.",links:{github:"https://github.com/j-m/browsability"},logo:"./images/logos/browsability.svg",preview:"",title:"Browsability"},FaktNews:{caption:"",date:"2017-09-12",description:"FaktNews grades the trustworthiness of the website you're currently viewing. This project is a recreation of my team's submission at AstonHack 2017; I originally designed and created the front-end, but decided I wanted to redo the whole project to create a faster, more robust solution.",links:{github:"https://github.com/j-m/faktnews"},logo:"./images/logos/faktnews.svg",preview:"./images/previews/faktnews.png",title:"FaktNews"},PulfrichBird:{caption:"test",date:"2018-02-03",description:"3D Flappy Bird using the pulfrich effect. Get a pair of dark tinted sunglasses and pop out the left lens, and play away!",links:{demo:"demo/pulfrich/",github:"https://github.com/j-m/pulfrich-bird/"},logo:"./images/logos/pulfrich-bird.png",preview:"./images/previews/pulfrich-bird.png",title:"PulfrichBird"},DLE:{caption:"",date:"2018-02-17",description:"Visualises the licenses of all dependencies and displays any potential problems",links:{github:"https://github.com/j-m/dependency-license-explorer"},logo:"./images/logos/dle.png",preview:"",title:"Dependency License Explorer"},Widgets:{caption:"",date:"2018-01-02",description:"Collection of graphical widgets used in other projects. The current ones came from FaktNews. New features added as and when, this project has no objectives.",links:{github:"https://github.com/j-m/Widgets"},logo:"",preview:"",title:"Widgets"},TNA:{caption:"",date:"2017-10-29",description:"A recreation of <a href='http://agar.io'>agar.io</a>, this project is a continuation of my work from HackNotts 2017. I aim to completely recreate the game, at the moment I would say it has about 5% of the planned features. Error checking has been added but it's a bit strict at the moment, just (soft) refresh and try again if anything happens.",links:{github:"https://github.com/j-m/TotallyNotAgario"},logo:"",preview:"",title:"Totally Not Agario"},FaceSwap:{caption:"",date:"2017-09-18",description:"Face swap using OpenCV. Another independent recreation of a team submission at BrumHack 2017. Hit a bit of a wall in development, but I am currently researching OpenCV by looking at similar projects.",links:{github:"https://github.com/j-m/FaceSwap"},logo:"",preview:"",title:"Face Swap"},BSQuiz:{caption:"",date:"2012-12-08",description:"This game was designed to help my GCSE business studies classmates learn the definitions. This was made within a week so there's not much to it.",logo:"",preview:"",title:"Quiz"},Adventure:{caption:"",date:"2012-10-01",description:"My first 2D platformer. The levels are difficult, and the poor performance and control make it hard, but it is possible! Good luck... (It says at the end of the first level, but might not make it that far: press 'q' when near the flag to end the level)",links:{demo:"demo/the_adventure/"},logo:"",preview:"./images/previews/adventure.png",title:"Adventure"},AsteroidRun:{caption:"",date:"2012-08-27",description:"My first 2D sidescroller. The collision detection is awful, but there's a colour option in settings to make up for it.",links:{demo:"demo/rocket/"},logo:"",preview:"./images/previews/asteroid-run.png",title:"Asteroid Run"},RWP:{caption:"",date:"2015-02-01",description:"`Real World Project` Coursework. This app is a community based report system that allows the general public to submit problems to their local council. \n\n For example fly tipping, pot holes, or faulty lights. As lead programmer of the team it was my responsibility to select the appropriate tools for the job. The system would require evidence of the problem (pictures) so we needed to create a cross-platform mobile phone app. \n\n There were other restrictions to overcome as well: not all of the developers have access to the same level of equipment. One of us only had a Chromebook. After researching for two weeks I came up with the following combination: VS Code, React Native (and therefore Node.js), SQLite3, ",logo:"",preview:"",title:"Real World Project"},TankTrouble:{caption:"",date:"2015-02-1",description:"Local multiplayer tank battle game. You can add players until you run out of keys (or re-use them if you're up for a challenge). The environment is a procedurally generate maze with x (user-defined) random walls removed. Bullets bounce twice before they get absorbed.",logo:"",preview:"./images/previews/tank-trouble.png",title:"Tank Trouble"},Minesweeper:{caption:"",date:"2015-01-15",description:"A simple Minesweeper clone",logo:"",preview:"./images/previews/minesweeper.png",title:"Minesweeper"},Encrypt:{caption:"",date:"2014-12-18",description:"A simple cipher encryption and decryption file application.",logo:"",preview:"./images/previews/encrypt.png",title:"Encrypt"},Maze:{caption:"",date:"2012-07-01",description:"A simple procedural maze generator that I created in a couple of days during my year 10 works experience.",logo:"",preview:"./images/previews/csmaze.png",title:"Maze"}};var tagable = {tags:tags,tagged:tagged,resources:resources};

var json = /*#__PURE__*/Object.freeze({
	__proto__: null,
	tags: tags,
	tagged: tagged,
	resources: resources,
	'default': tagable
});

const tagable$1 = new Tagable.Tagable();
tagable$1.import(json);

export { tagable$1 as t };
