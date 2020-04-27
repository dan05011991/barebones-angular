// import React, { Component } from 'react'
// import Spinner from 'react-bootstrap/Spinner';
// import Button from 'react-bootstrap/Button';

// class CarSpec extends Component {
//   render() {
//     return (
//       <div>
        
//       </div>
//     );
//   }
// }

// export default CarSpec;


import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



class CarSpec extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      A4 : []
    }
  }


  render() {
    return (
      <div >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography >Specification</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Car spec details
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default CarSpec;