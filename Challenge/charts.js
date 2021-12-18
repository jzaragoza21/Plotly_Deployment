// d3.json("samples.json").then(function(data){
//   console.log(data);
// });

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids; 
    var otu_labels = sampleResult.otu_labels; 
    var sample_values = sampleResult.sample_values; 

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // var sortedOtu_ids = samples.sort((a, b) => b.otu_ids - a.otu_ids);

    // slicedOtu_ids = sortedOtu_ids.slice(0, 10); 
    // var sortedSample_values = samples.sort((a, b) => b.sample_values - a.sample_values);

    // slicedSample_values = sortedSample_values.slice(0, 10); 
    // reversedSample_values = slicedSample_values.reverse();
    // var newSample_values = reversedSample_values.map(object => object.sample_values);eversedOtu_ids = slicedOtu_ids.reverse();
    // var yticks = reversedOtu_ids.map(object => object.otu_ids);

    var sampleValues = sample_values.slice(0,10).reverse();
    var sampleOtu_ids = otu_ids.slice(0,10).reverse();
    var sampleOtu_labels = otu_labels.slice(0, 10).reverse();
    
    // 

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sampleValues,
      y: sampleOtu_ids.map(outId => `OTU ${outId}`),
      text: sampleOtu_labels,
      marker: {
      color: 'blue'},
      name: "Top 10 Bacteria Cultures Found",
      type: "bar", 
      orientation: "h"
    };

    var barData = [trace1];
    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "Top 10 Bacteria Cultures F", 
      yaxis: sampleOtu_ids, 
      automargin: true
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, layout);
  

// Bar and Bubble charts
    var trace2 = { 
      x: otu_ids, 
      y: sample_values.reverse(), 
      text: otu_labels, 
      mode: 'markers', 
      marker:{
        color: otu_ids,
        size: sample_values 
      }
    }
    // 1. Create the trace for the bubble chart.
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample", 
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      hovermode: otu_labels,
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, layout); 

// Building guage chart 


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    metaResults = data.metadata.filter(sampleObj => sampleObj.id == sample);
		console.log(metaResults); 

    // Create a variable that holds the first sample in the array.
    var metaArray = metaResults.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var metaSampleResult = metaArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    Object.entries(metaSampleResult ).forEach(
			([key, value]) => d3.select("#sample-metadata"))

    // 3. Create a variable that holds the washing frequency.
    var wfreqs = metaSampleResult.wfreq;

   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wfreqs,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 9] },
          bar: { color: "grey" },
          steps: [
						{ range: [0, 1], color: 'crimson' },
						{ range: [1, 2], color: 'red' },
						{ range: [2, 3], color: 'yellow' },
						{ range: [3, 4], color: 'green' },
						{ range: [4, 5], color: 'teal' },
						{ range: [5, 6], color: 'cornflowerblue' },
						{ range: [6, 7], color: 'darkblue' },
						{ range: [7, 8], color: 'purple' },
						{ range: [8, 9], color: 'magenta' },
					],
				}
			}
		];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  
  })
};