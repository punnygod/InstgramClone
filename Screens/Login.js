import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {MyTextInputField} from '../components/MyTextField';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const logo = require('../assets/logo.png');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }
  componentDidMount() {}
  onChangeMyText = (type, data) => {
    this.setState({[type]: data});
  };
  handleLogin = async () => {
    if(this.state.email.length>0 && this.state.password.length>0){
    this.setState({submitLogin: true, errorText: null});
    auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(response => {
        this.setState({submitLogin: false});
        if (response?.user?.uid) {
          firestore()
            .collection('Users')
            .doc(response?.user?.uid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.exists) {
                this.props.handlelogin({
                  ...documentSnapshot.data(),
                  uid: response?.user?.uid,
                });
              }
            });
        }
      })
      .catch(error => {
        console.log('error', error);
        if (error.code === 'auth/wrong-password') {
          this.setState({errorText: 'Wrong Password'});
        } else if (error.code === 'auth/invalid-email') {
          this.setState({errorText: 'The email address is invalid!'});
        } else if (error.code == 'auth/user-not-found') {
          this.setState({errorText: 'No user found with this email id'});
        } else {
          this.setState({errorText: 'Something went wrong'});
        }
        this.setState({submitLogin: false});
      });
    }
    else{
      ToastAndroid.show("Please enter email and password",ToastAndroid.SHORT)
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        <View
          style={{
            marginHorizontal: 10,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <MyTextInputField
            attrName="email"
            title="Username or email address"
            value={this.state.email}
            onChangeMyText={this.onChangeMyText}
          />
          <MyTextInputField
            attrName="password"
            title="Password"
            value={this.state.password}
            onChangeMyText={this.onChangeMyText}
            otherTextInputProps={{
              secureTextEntry: true,
            }}
          />
          {this.state.errorText ? (
            <Text style={styles.errorText}>{this.state.errorText}</Text>
          ) : null}
          <TouchableOpacity
            style={{width: '100%'}}
            onPress={() => {
              this.handleLogin();
            }}>
            <View style={styles.buttonContainer}>
              {this.state.submitLogin ? (
                <ActivityIndicator color={'silver'} size="small" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={[styles.row, styles.signupTextContainer]}>
            <Text style={styles.accountText}>Don't have an account ? </Text>
            <Text
              style={styles.signupText}
              onPress={() => this.props.navigation.navigate('Signup')}>
              Sign up
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps, actions, null)(Login);
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    width: '90%',
    textAlign: 'right',
  },
  accountText: {
    color: '#8f8f8f',
    fontSize: 14,
  },
  logo: {
    height: 70,
    resizeMode: 'contain',
  },
  fbImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
  },
  signupTextContainer: {
    marginTop: 25,
  },
  textInputStyle: {
    borderWidth: 1,
    width: '40%',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#0095f6',
    color: '#fff',
    margin: 8,
    borderRadius: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  forgotPassText: {
    color: '#1098f6',
    fontSize: 15,
    width: '90%',
    textAlign: 'right',
    marginBottom: 15,
    marginTop: 10,
  },
  signupText: {
    color: '#1098f6',
    fontSize: 15,
    fontWeight: '700',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
});
