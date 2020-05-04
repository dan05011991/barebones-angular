import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';



class CarSpec extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      A4 : []
    }
  }


  render() {

    const specItems = this.props.specs.map((spec, index) => 
      <ListItem button><ListItemText primary={spec}></ListItemText></ListItem>
    );

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
            <List component="nav" aria-label="Car Specification">
              {specItems}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return { 
      specs: state.carPurchase.selectedSpec
  };
};

export default connect(mapStateToProps)(CarSpec);