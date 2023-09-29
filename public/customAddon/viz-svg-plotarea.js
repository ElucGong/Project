const iconMap = {
    'California': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Nevada': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Oregon': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Location.png',
    'Carbonated Drinks': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/CarbonatedDrinks.png',
    'Juices': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Juices.png',
    'Alcohol': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Alcohol.png',
    'Others': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Others.png',
    'Gross Margin': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/GrossMargin.png',
    'Discount': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Discount.png',
    'Original Sales Price': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Price.png',
    'City': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/City.png',
    'Info': 'https://fp68static.cfapps.eu10-004.hana.ondemand.com/sap-icons/Info.png',
};

// For PoC

const SVG_NS = 'http://www.w3.org/2000/svg';

const setElementAttributes = (element, attribute) => {
    Object.entries(attribute || {}).forEach(([key, value]) => {
        element?.setAttribute(key, value);
    });
};

const PLOTAREA_ICON_SIZE = 22;
class ChartOverlayComponent extends HTMLElement {

    constructor() {
        super();

        this._rounded = true;
        this._dataMarkerSize = 0;
        this._axisLabelColor = '#333';
        const container = this._container = document.createElementNS(SVG_NS, 'svg');
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._seriesAndAxisGroup = document.createElementNS(SVG_NS, 'g');
        container.appendChild(this._seriesAndAxisGroup);
        this._shadowRoot.appendChild(container);
    }

    getSeriesAndAxisSVGGroup() {
        return this._seriesAndAxisGroup;
    }

    render() {
        this._seriesAndAxisGroup.innerHTML = '';

        const supportedChartTypes = [
            'barcolumn',
            'stackedbar',
            'line',
            'area',
        ];

        if (!supportedChartTypes.includes(this._chartType)) {
            return;
        }

        const { width: chartWidth, height: chartHeight } = this._size;

        const containerAttr = {
            width: chartWidth,
            height: chartHeight,
        };

        Object.entries(containerAttr).forEach(([key, value]) => {
            this._container.setAttribute(key, value);
            this._seriesAndAxisGroup.setAttribute(key, value);
        });

        this._series.forEach((singleSeries, index) => {
            const options = {
                color: singleSeries.color,
                showAsTriangle: singleSeries.showAsTriangle,
                isLast: index === 0,
            };
            this.renderASeries(singleSeries, options);
        });

        this.renderAxisLabels(this._xAxisLabels);
        this.renderAxisLabels(this._yAxisLabels);
        this.renderAxisStackLabels(this._xAxisStackLabels);
        this.renderAxisStackLabels(this._yAxisStackLabels);

    }

    renderASeries(singleSeries, options) {
        singleSeries.dataPoints.forEach((dataPoint) => {
            const { dataInfo, labelInfo } = dataPoint;
            this.renderData(dataInfo, options);
            this.renderLabel(labelInfo, options, dataInfo);
        });
    }

    renderData(dataInfo, options) {
        if (!dataInfo) {
            return;
        }
        let { x, y, width, height } = dataInfo;
        let dataElement = document.createElementNS(SVG_NS, 'rect');
        const increment = this._dataMarkerSize / 100;
        const color = dataInfo.color || options.color;
        let dataElementAttr = {};
        let strokeWidth;
        let radius;

        if (options?.showAsTriangle) {
            const originalWidth = width;
            const originalHeight = height;
            dataElement = document.createElementNS(SVG_NS, 'circle');
            width = height = Math.min(originalWidth, originalHeight) * (1 + increment);
            x = width === originalWidth ? x : x + (originalWidth - width) / 2;
            y = height === originalHeight ? y : y + (originalHeight - height) / 2;
            radius = width / 2;
            strokeWidth = radius * .5;
            dataElementAttr = {
                cx: x + radius,
                cy: y + radius,
                r: radius * .75,
                'stroke-width': strokeWidth,
                stroke: color,
                fill: 'transparent',
            };
        } else {
            const dCommands = [];
            switch(this._chartType) {
            case 'barcolumn':
            case 'stackedbar':
                if (this._isHorizontal) {
                    height = height * (1 + increment);
                    y = y - height * increment / 2;
                    if (!this._rounded || this._chartType === 'stackedbar' && !options.isLast) {
                        dataElementAttr = {
                            x,
                            y,
                            width,
                            height,
                            fill: color
                        };
                        break;
                    }
                    dataElement = document.createElementNS(SVG_NS, 'path');
                    radius = Math.min(width, height / 2);
                    dCommands.push(`M ${x} ${y}`);
                    dCommands.push(`h ${width - radius}`);
                    dCommands.push(`a ${radius} ${radius} 0 0 1 ${radius}, ${radius}`);
                    dCommands.push(`v ${height - 2 * radius}`);
                    dCommands.push(`a ${radius} ${radius} 0 0 1 ${-radius}, ${radius}`);
                    dCommands.push(`H ${x}`);
                    dCommands.push(`Z`);
                    dataElementAttr = {
                        fill: color,
                        d: dCommands.join(' ')
                    }
                } else {
                    width = width * (1 + increment);
                    x = x - width * increment / 2;
                    if (!this._rounded || this._chartType === 'stackedbar' && !options.isLast) {
                        dataElementAttr = {
                            x,
                            y,
                            width,
                            height,
                            fill: color
                        };
                        break;
                    }
                    dataElement = document.createElementNS(SVG_NS, 'path');
                    radius = Math.min(width / 2, height);
                    dCommands.push(`M ${x} ${y+radius}`);
                    dCommands.push(`a ${radius} ${radius} 0 0 1 ${radius}, ${-radius}`);
                    dCommands.push(`h ${width - 2 * radius}`);
                    dCommands.push(`a ${radius} ${radius} 0 0 1 ${radius}, ${radius}`);
                    dCommands.push(`V ${y + height}`);
                    dCommands.push(`H ${x}`);
                    dCommands.push(`Z`);
                    dataElementAttr = {
                        fill: color,
                        d: dCommands.join(' ')
                    }
                }
                break;
            case 'line':
            case 'area':
                width = width * (1 + increment);
                height = height * (1 + increment);
                x = x - width * increment / 2;
                y = y - height * increment / 2;
                dataElement = document.createElementNS(SVG_NS, 'circle');
                radius = Math.min(height, width) / 2;
                strokeWidth = radius * .5;
                dataElementAttr = {
                    cx: x + radius,
                    cy: y + radius,
                    r: radius * .75,
                    'stroke-width': strokeWidth,
                    stroke: color,
                    fill: 'transparent',
                };
                break;
            }
        }
        setElementAttributes(dataElement, dataElementAttr);
        this._seriesAndAxisGroup.appendChild(dataElement);
    }

    renderLabel(labelInfo, options, dataInfo = undefined) {
        if (!labelInfo) {
            return;
        }
        if (Array.isArray(labelInfo)) {
            labelInfo.forEach((label) => {
                this.renderLabel(label, options, dataInfo);
            });
            return;
        }
        const { x, y, width, height, varianceLabelType, color, fontSize } = labelInfo;
        const labelText = document.createElementNS(SVG_NS, 'text');
        labelText.innerHTML = labelInfo.formattedValue;

        const bgColor = 'transparent';
        let labelColor = this._chartType.startsWith('stacked') ? '#666' : options.color;
        if (varianceLabelType !== undefined) {
            labelColor = color;
        }

        const labelAttr = {
            fill: labelColor,
            x,
            y: y + height * .75,  // The baseline of text is different
            width,
            height,
            style: `background-color: ${bgColor}; color: ${labelColor}; font-size: ${fontSize};`
        };
        setElementAttributes(labelText, labelAttr);
        this._seriesAndAxisGroup.appendChild(labelText);
    }

    _renderAxisLabel(label) {
        if (!label) {
            return;
        }
        const { x, y, width, height, pointValue, formattedValue, fontSize } = label;
        const _axisLabelColor = this._axisLabelColor;

        const labelElement = document.createElementNS(SVG_NS, 'text');
        labelElement.innerHTML = formattedValue;
        const labelElementAttr = {
            x: x - PLOTAREA_ICON_SIZE - 4,
            y: y + height * .75,    // The baseline of text is different
            width,
            height,
            fill: _axisLabelColor,
            style: `font-size: ${fontSize}; color: ${_axisLabelColor}`,
        };
        setElementAttributes(labelElement, labelElementAttr);
        this._seriesAndAxisGroup.appendChild(labelElement);

        const iconImg = document.createElementNS(SVG_NS, 'image');
        const iconImgAttr = {
            x: x + width - PLOTAREA_ICON_SIZE,
            y: y + (height - PLOTAREA_ICON_SIZE) / 2,
            width: PLOTAREA_ICON_SIZE,
            height: PLOTAREA_ICON_SIZE,
            'href': iconMap[pointValue] || iconMap.City || iconMap.Info,
        };
        setElementAttributes(iconImg, iconImgAttr);
        this._seriesAndAxisGroup.appendChild(iconImg);
    };

    renderAxisLabels(axisLabels) {
        if (axisLabels && !Array.isArray(axisLabels)) {
            this._renderAxisLabel(axisLabels);
        } else {
            axisLabels.forEach((labels) => this.renderAxisLabels(labels));
        }
    }

    renderAxisStackLabel(stackLabelInfo) {
        if (!stackLabelInfo) {
            return;
        }

        const {
            x, y, width, height, formattedValue, fontSize
        } = stackLabelInfo;

        const stackLabelElement = document.createElementNS(SVG_NS, 'text');
        const axisLabelColor = this._axisLabelColor;
        const bgColor = 'transparent';
        const stackLabelElementAttr = {
            x,
            y: y + height * .75,
            width,
            height,
            fill: axisLabelColor,
            'font-size': fontSize,
            'background-color': `${bgColor}; color: ${axisLabelColor}; font-size: ${fontSize};`
        };

        stackLabelElement.innerHTML = formattedValue;
        setElementAttributes(stackLabelElement, stackLabelElementAttr);
        this._seriesAndAxisGroup.appendChild(stackLabelElement);
    }

    renderAxisStackLabels(axisStackLabels) {
        if (!axisStackLabels) {
            return;
        }
        if (axisStackLabels && !Array.isArray(axisStackLabels)) {
            this.renderAxisStackLabel(axisStackLabels);
        } else {
            axisStackLabels.forEach((stackLabels) => {
                this.renderAxisStackLabels(stackLabels);
            });
        }
    }

    setExtensionData(extensionData) {
        const {
            chartType,
            isHorizontal,
            chartSize,
            clipPath,
            series,
            xAxisLabels,
            xAxisStackLabels,
            yAxisLabels,
            yAxisStackLabels,
        } = extensionData;
        this._size = chartSize;
        this._clipPath = clipPath;
        this._series = series;
        this._xAxisLabels = xAxisLabels;
        this._yAxisLabels = yAxisLabels;
        this._xAxisStackLabels = xAxisStackLabels;
        this._yAxisStackLabels = yAxisStackLabels;
        this._chartType = chartType;
        this._isHorizontal = isHorizontal;
        this.render();
    }

    set rounded(value) {
        this._rounded = value;
        this.render();
    }

    set dataMarkerSize(value) {
        this._dataMarkerSize = value;
        this.render();
    }

    set axisLabelColor(value) {
        this._axisLabelColor = value;
        this.render();
    }
}

customElements.define('viz-overlay', ChartOverlayComponent);
