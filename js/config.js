var IS_TEST_RUN = true;

// Insert random configuration here:
// First, numbers 1 to 18 shuffled (custom data),
// Then, numbers 1 to 7 shuffled (real world data).
var SEED = [1,2,3,4,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1,2,3,4,5,6,7];

// Task numbers at which task 2 and 3 start
var TASK_LENGTH = [2,4];

// max number of clusters which ever appears in a dataset
var MAX_CLUSTERS = 5;

function getFiles() {

    var files = [];
    SEED.forEach(function(value, index) {
        var file;
        var noise; 
        var rw_files = [
            "RW01-airquality-normalized.csv",
            "RW02-breasttissue-normalized.csv",
            "RW03-ecoli-normalized.csv",
            "RW04-forestfires-normalized.csv",
            "RW05-glass-normalized.csv",
            "RW06-iris-normalized.csv",
            "RW07-wine-normalized.csv"];
        if (index < 18) {
            if (index < 4) {
                file = "Noise_" + [150,200,300,400][value] + ".csv";
            }
            else {
                if (index < 10) {
                    noise = "90";
                } 
                else if (index < 16) {
                    noise = "60";
                }
                else {
                    noise = "120";
                }
                file = "datasets_PC/" + noise + "%25Noise/" + value.pad(2) + "_" + noise + "%25Noise.csv";
            }
        }
        else {
            file = "datasets_PC/" + rw_files[value];
        }
        files.push("data/" + file);
    });
    return files;
}

// Add leading zeros
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}