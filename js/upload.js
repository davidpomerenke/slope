var ownFiles = {}

function upload(e) {
    document.getElementById("header").style.height = "280px"
    var readfiles = e.target.files
    var i = 0
    for (file of readfiles) {
        if (!file) {
            return
        }
        var reader = new FileReader()
        reader.onload = function (e) {
            var contents = e.target.result
            var name = document.getElementById("file-input").files[i].name
            ownFiles[name] = contents
            files.push([name, name])
            initialize([[name, name]], uploaded = true)
            i++
        }
        reader.readAsText(file)
    }
}

document.getElementById("file-input")
  .addEventListener('change', upload, false)