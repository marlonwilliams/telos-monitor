import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap'
import FormCustomControl from '../FormControls/FormCustomControl'
import serverAPI from '../../scripts/serverAPI'

class ModalRegisterProducer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producerName: "",
            organization: "",
            serverLocation: "",
            httpServerAddress: "",
            httpsServerAddress: "",
            p2pListenEndpoint: "",
            p2pServerAddress: "",
            producerPublicKey: "",
            ownerPublicKey: "",
            activePublicKey: "",
            url: "",
            telegramChannel: "",
            psswrd: ""
        }
    }

    onModalHide() {
        this.props.onHide();
    }

    onRegister() {
        let producer = {};
        producer.name = this.state.producerName;
        producer.organization = this.state.organization;
        producer.serverLocation = this.state.serverLocation;
        producer.httpServerAddress = this.state.httpServerAddress;
        producer.httpsServerAddress = this.state.httpsServerAddress;
        producer.p2pListenEndpoint = this.state.p2pListenEndpoint;
        producer.p2pServerAddress = this.state.p2pServerAddress;
        producer.producerPublicKey = this.state.producerPublicKey;
        producer.ownerPublicKey = this.state.ownerPublicKey;
        producer.activePublicKey = this.state.activePublicKey;
        producer.url = this.state.url;
        producer.telegramChannel = this.state.telegramChannel;
        producer.psswrd = this.state.psswrd;

        serverAPI.registerProducerNode(producer,(res)=>{
            alert(res);
            this.onModalHide();
        });
    }

    onProducerNameChange(arg) {
        this.setState({
            producerName: arg.target.value
        });
    }

    getProducerNameValidationState() {
        const length = this.state.producerName.length;
        if (length != 12) return 'error';
        else return 'success';

        return null;
    }

    onOrganizationChange(arg) {
        this.setState({
            organization: arg.target.value
        })
    }

    onServerLocationChange(arg) {
        this.setState({
            serverLocation: arg.target.value
        })
    }

    onHttpServerAddressChange(arg) {
        this.setState({
            httpServerAddress: arg.target.value
        })
    }

    onHttpsServerAddressChange(arg) {
        this.setState({
            httpsServerAddress: arg.target.value
        })
    }

    onP2pListenEndpointChange(arg) {
        this.setState({
            p2pListenEndpoint: arg.target.value
        })
    }

    onP2pServerAddressChange(arg) {
        this.setState({
            p2pServerAddress: arg.target.value
        })
    }

    onProducerPublicKeyChange(arg) {
        this.setState({
            producerPublicKey: arg.target.value
        })
    }

    onOwnerPublicKeyChange(arg) {
        this.setState({
            ownerPublicKey: arg.target.value
        })
    }

    onActivePublicKeyChange(arg) {
        this.setState({
            activePublicKey: arg.target.value
        })
    }
    
    onUrlChange(arg) {
        this.setState({
            url: arg.target.value
        })
    }

    onTelegramChannelchange(arg) {
        this.setState({
            telegramChannel: arg.target.value
        })
    }

    onPsswrdChange(arg) {
        this.setState({
            psswrd: arg.target.value
        })
    }

    render() {
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Register node</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormCustomControl
                            id="txtProducerName"
                            validationstate={this.getProducerNameValidationState()}
                            label="Producer name"
                            type="text"
                            help="length 12, lowercase a-z, 1-5"
                            value={this.state.producerName}
                            onChange={(arg) => this.onProducerNameChange(arg)}
                        />
                        <FormCustomControl
                            id="txtOrganization"
                            label="Organization"
                            type="text"
                            value={this.state.organization}
                            onChange={(arg) => this.onOrganizationChange(arg)}
                        />
                        <FormCustomControl
                            id="txtServerLocation"
                            label="Server location"
                            help="Seattle, USA"
                            type="text"
                            value={this.state.serverLocation}
                            onChange={(arg) => this.onServerLocationChange(arg)}
                        />
                        <FormCustomControl
                            id="txtHttpServerAddress"
                            label="Http server address"
                            type="text"
                            help="0.0.0.0:8888"
                            value={this.state.httpServerAddress}
                            onChange={(arg) => this.onHttpServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtHttpsServerAddress"
                            label="Https server address"
                            type="text"
                            help="0.0.0.0:443"
                            value={this.state.httpsServerAddress}
                            onChange={(arg) => this.onHttpsServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtP2pListenEndpoint"
                            label="P2P Listen endpoint"
                            type="text"
                            help="0.0.0.0:9876"
                            value={this.state.p2pListenEndpoint}
                            onChange={(arg) => this.onP2pListenEndpointChange(arg)}
                        />
                        <FormCustomControl
                            id="txtP2pServerEndpoint"
                            label="P2P server address"
                            type="text"
                            help="IP_ADDRESS:9876"
                            value={this.state.p2pServerAddress}
                            onChange={(arg) => this.onP2pServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtProducerPublicKey"
                            label="Producer public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.producerPublicKey}
                            onChange={(arg) => this.onProducerPublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtOwnerPublicKey"
                            label="Owner public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.ownerPublicKey}
                            onChange={(arg) => this.onOwnerPublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtActivePublicKey"
                            label="Active public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.activePublicKey}
                            onChange={(arg) => this.onActivePublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtTelegramChannel"
                            label="Telegram channel"
                            type="text"
                            help="@yourTelegramChannel"
                            value={this.state.telegramChannel}
                            onChange={(arg) => this.onTelegramChannelchange(arg)}
                        />
                        <FormCustomControl
                            id="txtURL"
                            label="URL"
                            type="text"
                            help="http://telosfoundation.io"
                            value={this.state.url}
                            onChange={(arg) => this.onUrlChange(arg)}
                        />
                        <FormCustomControl
                            id="txtPassword"
                            label="Password"
                            type="password"
                            value={this.state.psswrd}
                            onChange={(arg) => this.onPsswrdChange(arg)}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                    <Button onClick={() => this.onRegister()}>Register</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ModalRegisterProducer;