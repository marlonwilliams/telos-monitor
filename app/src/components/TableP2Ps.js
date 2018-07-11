import React, { Component } from 'react';
import serverAPI from '../scripts/serverAPI';
import { withRouter } from 'react-router-dom';
import { Table } from 'react-bootstrap'
import '../styles/tableproducers.css'

class TableP2Ps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: []
        }
    }

    componentWillMount() {
        serverAPI.getAllAccounts((res) => {
            this.setState({
                accounts: res.data
            })
            console.log(this.state.accounts)
        });
    }
    
    renderTableBody() {
        if (this.state.accounts.length > 0) {
            let body =
                <tbody>
                    {
                        this.state.accounts.map((val, i) => {
                            return (
                                <tr key={i}>    
                                    <td>{i+1}</td>
                                    <td>{val.name}</td>
                                    <td>{val.organization}</td>
                                    <td>{val.url}</td>
                                    <td>{val.p2pServerAddress}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                return body;
        }
    }

    render() {
        return (
            <div>
                <h2>Accounts peers</h2>
                <div className="tableContainer">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Account</th>
                                <th>Organization</th>
                                <th>URL</th>
                                <th>Peer server address</th>
                            </tr>
                        </thead>
                        {this.renderTableBody()}
                    </Table>
                </div>
            </div>
        );
    }
}

export default TableP2Ps;