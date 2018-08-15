import React, { Component } from 'react';
import '../../styles/tableproducers.css'
import { Row, Col, Table, Alert } from 'react-bootstrap'
import ModalProducerInfo from '../Modals/ModalProducerInfo'
import nodeInfoAPI from '../../scripts/nodeInfo'
import getHumanTime from '../../scripts/timeHelper'
import serverAPI from '../../scripts/serverAPI';
import ProducerMap from '../ProducerMap';
import FormTextboxButton from '../FormControls/FormTextboxButton';

const SORT_BY_PROD = 'sortByProducerName';
const SORT_BY_PROD_REV = 'sortByProducerNameReverse';

class TableProducers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            producers: [],
            activeProducerName: '',
            totalVotesWheight: 0,
            currentBlockNumber: 0,
            blocksProduced: [],
            blockTime: 0,
            lastTimeProduced: [],
            producersLatency: [],
            showModalProducerInfo: false,
            producerSelected: '',
            producerFilter: '',
            sortBy: ''
        }
        this.updateProducersOrder = this.updateProducersOrder.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByNameReverse = this.sortByNameReverse.bind(this);
    }

    componentWillMount() {
        serverAPI.getAllAccounts(async (res) => {
            this.setState({
                accounts: res.data
            });
            if (await this.getProducersInfo()) {
                await this.updateProducersInfo();
            }
        });
    }

    componentDidMount() {
        let producerIndex = 0;
        setInterval(async () => {
            await this.getProducerLatency(producerIndex);
            if (++producerIndex > this.state.producers.length - 1) producerIndex = 0;
        }, 1000);

        //update producers every 5 minutes
        setInterval(()=>this.updateProducersOrder(), 2000);       
    }

    //gets producers, reorders them
    async updateProducersOrder(){
        let newProd = [];
        const {producers} = this.state;
        const newProdData = await nodeInfoAPI.getProducers();
        console.log(newProdData.rows);
        if(newProdData != null){
          for(let i = 0; i < newProdData.rows.length; i++){
            const thisOwner = newProdData.rows[i].owner;
            const thisRow = producers.find(row => row.owner === thisOwner);
            newProd[i] = thisRow;
          }
          //set state, remove empty values if they exist
          this.setState({producers: newProd.filter(el => el.owner)});
        }
    }

    async getProducersInfo() {
        let data = await nodeInfoAPI.getProducers();
        if (data != null) {
            let producers = data.rows;
            console.log({producers: producers});
            this.setState({
                producers: producers,
                totalVotesWheight: data.total_producer_vote_weight
            });
            return true;
        } else return false;
    }

    async updateProducersInfo() {
        if (this.state.producers.length > 0) {
            setInterval(async () => {
                let nodeInfo = await nodeInfoAPI.getInfo();
                if (nodeInfo != null) {
                    let producerIndex = this.state.producers.findIndex((bp) => bp.owner === nodeInfo.head_block_producer);
                    let blocksProduced = new Array(this.state.producers.length);
                    let lastTimeProduced = new Array(this.state.producers.length);

                    if (producerIndex > -1) {
                        blocksProduced = this.state.blocksProduced;
                        blocksProduced[producerIndex] = nodeInfo.head_block_num;

                        lastTimeProduced = this.state.lastTimeProduced;
                        lastTimeProduced[producerIndex] = nodeInfo.head_block_time;

                        await this.getProducerLatency(producerIndex);
                    }

                    this.setState({
                        activeProducerName: nodeInfo.head_block_producer,
                        currentBlockNumber: nodeInfo.head_block_num,
                        blockTime: nodeInfo.head_block_time,
                        blocksProduced: blocksProduced
                    });
                }
            }, 1000);
        }
    }

    getLastTimeBlockProduced(bpLastTimeProduced, headBlockTime) {
        let bpTime = new Date(bpLastTimeProduced);
        let headTime = new Date(headBlockTime);
        bpTime = Number(bpTime);
        headTime = Number(headTime);

        let lastTimeProduced = getHumanTime(Math.floor(headTime - bpTime) / 1000);
        return lastTimeProduced;
    }

    getProducerPercentage(bp) {
        if (parseFloat(bp.total_votes) > 0) {
            let producerPercentage = (parseFloat(bp.total_votes * 100)) / parseFloat(this.state.totalVotesWheight);
            let strProducerPercentage = producerPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

            return strProducerPercentage;
        }
        else return 0;
    }

    async getProducerLatency(producerIndex) {
        if (this.state.producers.length > 0 && this.state.accounts.length > 0) {
            let producerName = this.state.producers[producerIndex].owner;
            let matchedProducer = this.state.accounts.find((item) => item.name === producerName);
            if(matchedProducer){
                let url = matchedProducer.p2pServerAddress;
                let result = await serverAPI.getEndpointLatency(url);
                let pLatency = new Array(this.state.producers.length);
                pLatency = this.state.producersLatency;
                let latency = result != null ? result.latency : "-";
                pLatency[producerIndex] = latency != "-" ? latency < 1000 ? latency : "-" : "-";
                this.setState({
                    producersLatency: pLatency
                });    
            }
        }
    }

    showProducerInfo(producerSelected) {
        this.setState({
            producerSelected: producerSelected,
            showModalProducerInfo: !this.state.showModalProducerInfo
        });
    }

    sortByName(producers){
        return producers.sort((a, b) => {
            if(a.owner < b.owner) return -1;
            if(a.owner > b.owner) return 1;
            return 0;
        });
    }

    sortByNameReverse(producers){
        return producers.sort((a, b) => {
            if(a.owner < b.owner) return 1;
            if(a.owner > b.owner) return -1;
            return 0;
        });
    }


    renderTableBody() {
        const {sortBy} = this.state;
        if (this.state.producers.length > 0) {
            let prods; 
            
          if(this.state.producerFilter==="") prods = this.state.producers.filter(val => val.is_active === 1);
          else prods = this.state.producers.filter(val => val.is_active === 1 && val.owner.includes(this.state.producerFilter));
            
        const prodsCopy = prods.slice();
        //producers sort options
        switch(sortBy){
            case SORT_BY_PROD:
                prods = this.sortByName(prods);
                break;
            case SORT_BY_PROD_REV:
                prods = this.sortByNameReverse(prods);
                break;
            default:
                //do nothing
                break;
        }


          let body =
                <tbody>
                    {
                        prods.map((val, i) => {
                            const rankPosition = prodsCopy.findIndex(item => item.owner === val.owner);
                            return (
                                <tr key={i} className={val.owner === this.state.activeProducerName ? 'activeProducer' : ''}>
                                    <td>{i + 1}</td>
                                    <td>{rankPosition + 1}</td>
                                    <td>
                                        <a href={`producers/${
            val.owner}`} onClick={(e) => {
                                            e.preventDefault();
                                            this.showProducerInfo(val.owner);
                                        }}>
                                            {val.owner}
                                        </a>
                                    </td>
                                    <td>{this.state.producersLatency[rankPosition]} ms</td>
                                    <td>{rankPosition < 21 ? 
                                          val.owner === this.state.activeProducerName ? this.state.currentBlockNumber : this.state.blocksProduced[rankPosition] > 0 ? this.state.blocksProduced[rankPosition] : "-" 
                                        : '-'} </td>
                                    <td>{i < 21 ? 
                                          val.owner === this.state.activeProducerName ?
                                          "producing blocks..." :
                                          this.getLastTimeBlockProduced(this.state.lastTimeProduced[rankPosition], this.state.blockTime)
                                        : '0 sec'}
                                    </td>
                                    {/* <td>organization</td> */}
                                    <td>{this.getProducerPercentage(val) + "%"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>;
            return body;
        } else return (<div></div>);
    }

    onProducerFilterChange(arg) {
        let value = arg.target.value.trim();
        this.setState({ producerFilter: value });
    }

    render() {
        //get sort, and classes for table headers
        const {sortBy} = this.state;
        const prodNameClass = () => {
            let prodClass = 'sortable';
            switch(sortBy){
                case SORT_BY_PROD:
                    prodClass = 'sortable sortByProd';
                    break;
                case SORT_BY_PROD_REV:
                    prodClass = 'sortable sortByProdRev';
                    break;
                default:
                    prodClass = 'sortable';
                    break;
            }
            return prodClass;
        };

        if (this.state.producers.length > 0) {
            return (
                <div>
                    <Row>
                        <Col sm={7}>
                            <h2>Producers</h2>
                        </Col>
                        <Col sm={5}>
                            <FormTextboxButton
                                id="txtbProducerName"
                                type="text"
                                hasbutton={false}
                                value={this.state.producerFilter}
                                onChange={(arg) => this.onProducerFilterChange(arg)}
                                placeHolder="Filter by producer name"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <div className="tableContainer">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Rank</th>
                                            <th
                                                onClick={() => {
                                                    if(sortBy === SORT_BY_PROD){
                                                        this.setState({sortBy: SORT_BY_PROD_REV});
                                                    }else if(sortBy === SORT_BY_PROD_REV){
                                                        this.setState({sortBy: ''});
                                                    }else{
                                                        this.setState({sortBy: SORT_BY_PROD});
                                                    }
                                                }}
                                                className={prodNameClass()}
                                            >
                                                Name</th>
                                            <th>Latency</th>
                                            <th>Last block</th>
                                            <th>Last time produced</th>
                                            {/* <th>Organization</th> */}
                                            <th>Votes</th>
                                        </tr>
                                    </thead>
                                    {this.renderTableBody()}
                                </Table>
                            </div>
                        </Col>
                        <ModalProducerInfo show={this.state.showModalProducerInfo} onHide={() => this.showProducerInfo('')} producername={this.state.producerSelected} />
                    </Row>
                </div>
            );
        } else return (
            <Alert bsStyle="warning">
                <strong>Warning:</strong> There are no producers found yet.
            </Alert>
        );
    }
}

export default TableProducers;
