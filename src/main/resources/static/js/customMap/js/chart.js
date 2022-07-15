const magenta = "#aa0144";
const teal = "#045d5d";
const golden = "#df7701";
const navy = "#0b0b45";
const deepDark = "#181a19";
const dark = "#222423";
const medium = "#757164";
const light = "#9b9b98";
const superLight = "#fbfbf8";

const addDataAndLabelsToChart = (chartOutput, chartTotalDate, chartTotalData) => {
    chartOutput.data.labels = chartTotalDate;
    for (const dataIndex in chartTotalData) {
        chartOutput.data.datasets.forEach((dataset) => {
            dataset.data.push(chartTotalData[dataIndex]);
        });
    }
    chartOutput.update();
}

const removeData = (removeChart) => {
    removeChart.data.labels = '';
    removeChart.data.datasets.forEach((dataset) => {
        dataset.data = '';
    });
    removeChart.update();
}

const options = {
    responsive: true,
    responsiveAnimationDuration: 1000,
    animation: {
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        }
    },
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            ticks: {
                beginAtZero: true,
                userCallback: function (value) {
                    if( value === undefined || value === null ) { return 'empty'; }
                    return `${value.substring(2, 8)}`;
                },
                // autoSkip: false
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero: true,
                userCallback: function (value) {
                    return value+"mm ";
                }
            },
            gridLines: {
                color: medium
            }
        }],
    },
    annotation: {
        annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: '0',
            borderColor: golden,
            borderWidth: 1
        }],
        drawTime: "afterDraw"
    }
};

const generateChart = (ctx) => {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: 'Land Subsidence',
            datasets: [
                {
                    label: 'Land Subsidence',
                    fill: false,
                    borderColor: superLight,
                    borderWidth: 0,
                    lineTension: 0,
                    pointRadius: 0,
                },
                {
                    label: 'Land Subsidence',
                    fill: false,
                    type: 'bar',
                    borderColor: 'transparent',
                    backgroundColor: function(context) {
                        const index = context.dataIndex;
                        const value = context.dataset.data[index];
                        return value < 0 ? magenta : teal;
                    },
                    borderWidth: 0,
                    lineTension: 0,
                },
            ]
        },
        options: options
    });
}

