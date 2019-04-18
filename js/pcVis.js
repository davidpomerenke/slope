var selectedDim = [];

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getMarkingResults() {

    selectedDim = [];
    var clusters = [];
    var point_data = {};
    var cluster_data = {};
    var cluster_axis = {};
    var axis_clusters = [];
    var list = document.getElementsByClassName("extent");


    for (var i = 0; i < list.length; i++) {
        if (list[i].height.animVal.value !== 0) {
            clusters.push(list[i]);
        }
    }

    for (var c = 1; c <= MAX_CLUSTERS * 2 * 2; c++) {
        cluster_data["cluster " + c] = [];
        cluster_axis["cluster " + c] = "";
    }

    var dataLength = 0;
    if (document.getElementById("fground")) {
        dataLength = document.getElementById("fground").childElementCount;
    }

    for (var a = 0; a < dataLength; a++) {
        point_data["point " + a] = [];
        document.getElementById("fground").childNodes[a].id = a;
        var dataPath = document.getElementById(a.toString()).getAttribute('d');
        var temp1 = dataPath.split("M");
        temp1.splice(0, 1);
        var temp2 = temp1[0].split("L");
        var arr = [];

        for (var value = 0; value < temp2.length; value++) {
            var first = temp2[value].split(",");
            arr.push(first);
        }

        for (var c = 0; c < clusters.length; c++) {
            var upperbound = clusters[c].y.animVal.value;
            var lowerbound = clusters[c].height.animVal.value + upperbound;
            var myEl = clusters[c].parentNode.parentNode;
            var txt = myEl.getAttribute('transform').split(' ', 1)[0];
            var newString = txt.split("");
            newString.pop();
            newString.splice(0, 10);
            var positionX = Number(newString.join(""));
            for (var dim = 0; dim < numberOfDimensions; dim++) {
                var pointy = Number(arr[dim][1]);
                var pointx = Number(arr[dim][0]);
                if (pointy >= upperbound && pointy <= lowerbound && positionX === pointx) {
                    var num = c + 1;
                    selectedDim.push(dim + 1);
                    point_data["point " + a].push("cluster" + num);
                    cluster_data["cluster " + num].push("point " + a);
                    cluster_axis["cluster " + num] = dim + 1;
                }
            }
        }
    }

    var count = [0, 0];
    [cluster_data, point_data].forEach(function(data_list, type){
        Object.keys(data_list).forEach(function(key){
            var value = data_list[key];
            task_data[["points in ", "clusters of "][type] + key] = value.join("; ");
            task_data["nr of " + ["points in ", "clusters of "][type] + key] = value.length;
            if (value.length > 0) {
                count[type] += 1;
            }
        });
    });

    for (i=1; i<=numberOfDimensions; i++) {
        axis_clusters["dimension " + i] = []
    }
    Object.keys(cluster_axis).forEach(function(key){
        task_data["dimension of " + key] = cluster_axis[key];
        if (cluster_axis[key] != "") {
            axis_clusters["dimension " + cluster_axis[key]].push(key);
        }
    });
    for (i=1; i<= numberOfDimensions; i++) {
        task_data["clusters in dimension " + i] = axis_clusters["dimension " + i].join("; ");
        task_data["nr of clusters in dimension " + i] = axis_clusters["dimension " + i].length;
    }

    task_data["nr of clusters"] = count[0];
    task_data["nr of points"] = count[1];
}

function generateCSV() {

    var age = Number(document.getElementById("age").value);
    var vision;
    var level = "god";
    var course = document.getElementById("course").value.toLowerCase();
    var knowledge = {};
    var gender;
    var consent;
    var browserName;
    var majorVersion;
    var OSName;

    if (document.getElementById("vision").checked) {
        vision = "normal";
    } else {
        vision = "not normal";
    }

    if (document.getElementById("knowledge_DA").checked) {
        knowledge["da"] = 1;
    }
    else {
        knowledge["da"] = 0;
    }
    if (document.getElementById("knowledge_DV").checked) {
        knowledge["dv"] = 1;
    }
    else {
        knowledge["dv"] = 0;
    }
    if (document.getElementById("knowledge_PC").checked) {
        knowledge["pc"] = 1;
    }
    else {
        knowledge["pc"] = 0;
    }

    if (document.getElementById("bachelor").checked) {
        level = "bachelor";
    } else if (document.getElementById("master").checked) {
        level = "master";
    } else if (document.getElementById("phd").checked) {
        level = "phd";
    } else {
        level = "other";
    }

    if (document.getElementById("male").checked) {
        gender = "male";
    } else if (document.getElementById("female").checked) {
        gender = "female";
    } else {
        gender = "diverse";
    }

    if (document.getElementById("consent").checked) {
        consent = 1;
    } else {
        consent = 0;
    }

    // adapted from: http://www.javascripter.net/faq/browsern.htm
    var nAgt = navigator.userAgent;
    browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera 15+, the true version is after "OPR/" 
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    browserName = browserName.toLowerCase();
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="macos";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="unix";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="linux";

    var classification = [];

    for (var i = 0; i < 1; i++) {
        var obj = {
            "global user id": id,
            "gender": gender,
            "age": age,
            "vision": vision,
            "level": level,
            "course of study": course,
            "data analysis": knowledge["da"],
            "data visualization": knowledge["dv"],
            "parallel coordinates": knowledge["pc"],
            "consent": consent,
            "browser": browserName,
            "version": majorVersion,
            "os": OSName
        };
        classification.push(obj);
    }
    download(Number(id).pad(2), [classification, data["task 1"], data["task 2"], data["task 3"]].map(ConvertToCSV).join("\nSEPARATOR\n\n"));
}