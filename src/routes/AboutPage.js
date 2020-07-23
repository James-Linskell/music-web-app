import React from 'react';

class AboutPage extends React.Component {
    render() {
        return (
            <div>
                About {this.props.search}
            </div>
        )
    }
}

export default AboutPage;