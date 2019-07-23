# Slope-Dependent Rendering of Parallel Coordinates to Reduce Density Distortion and Ghost Clusters

This is the supplementary material for: 

> David Pomerenke, Frederik L. Dennig, Daniel A.Keim, Johannes Fuchs, Michael Blumenschein.
Slope-Dependent Rendering of Parallel Coordinates to Reduce Density Distortion and Ghost Clusters. 
Conditionally accepted at: 
IEEE Conference on Information Visualization 2019, shortpaper track. 

## Testing tool

![Screenshot of the testing tool](screenshot.png)

For the purpose of testing the effect of our adjustment technique, we have implemented a testing tool. 
The tool offers many synthetic and real world data sets for display, as well as the possibility to add own datasets. It allows to continuously manipulate parameter P and compare the effect to standard PCP renderings. 
It is also possible to manipulate all other relevant parameters, namely the adjusted constant line width factor h, opacity, axis height, axis spacing, line colour, and rendering technique.

### Launch

#### Online

The tool is online at [davidpomerenke.github.io/slope](https://davidpomerenke.github.io/slope). 
Note that adding own datasets is currently unsupported by the online version. 

#### Local

Loading data files locally is disabled in browsers for security reason. 
Therefore, a local webserver has to be started; this can be easily done with Python.

Please navigate inside the main directory (which includes the _index.html_ ). 
From this directory, execute:

    python -m http.server

Now you can access the testing tool from the URL displayed, which is usually [localhost:8000](https://localhost:8000).

### Usage

On the left side, the regular PCPs (including distortion and ghost clusters) are displayed. 
On the right side, our slope-dependent adjustment technique can be applied to either line width (which is pre-selected) or opacity (which is just experimental) by checking the respective boxes. In either case, _parameter P_ determines the strength of the effect and is also only applied to the right-hand PCP.
_Adjusted h_ refers to a constant line height factor, which is also only applied to the PCP on the right.

The other parameters are the constant parts of line width and line opacity, the height and spacing of the axes and the colour, including a multi-colour option to easily identify the clusters. 
All these parameters apply to the PCPs on both sides.

Rendering can be switched to rendering lines as polygonal parallelograms.
In this case, parameter P has no effect any longer.

### Add own datasets

Own datasets can be added as _csv_-files in the subdirectory _data/own/_.
File names have to be added to the _list.js_ file inside this directory. 
An optional column _cluster_ in the _csv_-file may be used for the multi-colour display option.

### Data creation

Most of the datasets for the tool have been created with: 

> PCDC - On the Highway to Data - A Tool for the Fast Generation of Large Synthetic Data Sets. 
Sebastian Bremm, Martin Heß, Tatiana Von Landesberger & Dieter W. Fellner. 
Work published 2012 via The Eurographics Association. 
EuroVA 2012: International Workshop on Visual Analytics. 
[doi.org/10.2312/pe/eurovast/eurova12/007-011](https://doi.org/10.2312/pe/eurovast/eurova12/007-011)

This process can be replicated by loading the _.ini_-files from the data folder to the _PCDC_ tool. 
Unfortunately, the tool appears not to be available online at the moment. 
