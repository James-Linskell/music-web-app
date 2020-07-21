import React from 'react';
import "../styles/BackgroundSvgPaths.css";


class BackgroundSvgPaths extends React.Component {
    render() {
        return (
            <div className="background">
                <svg viewBox="0 0 1920 2140" style={{top: this.props.shiftDown}}>
                    <path fill={this.props.fill}
                          d="M 0.00,1811.00
           C 0.00,1811.00 0.00,1214.00 0.00,1214.00
             0.00,1214.00 0.99,1206.61 0.99,1206.61
             0.99,1206.61 9.00,1201.00 9.00,1201.00
             9.00,1201.00 25.00,1191.20 25.00,1191.20
             25.00,1191.20 107.00,1141.20 107.00,1141.20
             107.00,1141.20 449.00,932.80 449.00,932.80
             449.00,932.80 726.00,763.81 726.00,763.81
             726.00,763.81 1059.00,560.81 1059.00,560.81
             1059.00,560.81 1328.00,396.81 1328.00,396.81
             1328.00,396.81 1450.00,322.58 1450.00,322.58
             1450.00,322.58 1595.00,234.19 1595.00,234.19
             1595.00,234.19 1776.00,123.80 1776.00,123.80
             1776.00,123.80 1875.00,63.40 1875.00,63.40
             1875.00,63.40 1904.00,45.80 1904.00,45.80
             1904.00,45.80 1920.00,37.00 1920.00,37.00
             1920.00,37.00 1920.00,633.00 1920.00,633.00
             1920.00,633.00 1918.98,640.82 1918.98,640.82
             1918.98,640.82 1911.00,647.00 1911.00,647.00
             1911.00,647.00 1895.00,656.80 1895.00,656.80
             1895.00,656.80 1814.00,706.05 1814.00,706.05
             1814.00,706.05 1670.00,793.81 1670.00,793.81
             1670.00,793.81 1470.00,915.80 1470.00,915.80
             1470.00,915.80 1271.00,1037.19 1271.00,1037.19
             1271.00,1037.19 961.00,1226.19 961.00,1226.19
             961.00,1226.19 628.00,1429.19 628.00,1429.19
             628.00,1429.19 465.00,1528.42 465.00,1528.42
             465.00,1528.42 155.00,1717.42 155.00,1717.42
             155.00,1717.42 51.00,1780.81 51.00,1780.81
             51.00,1780.81 18.00,1801.00 18.00,1801.00
             18.00,1801.00 0.00,1811.00 0.00,1811.00 Z" />
                </svg>
            </div>
        )
    }
}

export default BackgroundSvgPaths;