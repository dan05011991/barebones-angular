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



class CarOptions extends Component {

  render() {

    const optionItems = this.props.options.map((option, index) => 
      <ListItem key={index} button><ListItemText primary={option}></ListItemText></ListItem>
    );

    return (
      <div >
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography >Options</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <List component="nav" aria-label="Car Options">
              {optionItems}
          </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
      options: state.carPurchase.selectedOptions
  };
};

export default connect(mapStateToProps)(CarOptions);