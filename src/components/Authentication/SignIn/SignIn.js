import React, { Component } from 'react';
import axios from '../../../axios';
import classes from '../../../css/Form.module.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as AuthActions from '../../../store/actions/auth';
import Input from '../../UI/Input/Input';
import { checkValidity } from '../../../shared/validate';
import { sendEmail } from '../../../shared/Email';
import PinkButton from '../../UI/Button/PinkButton';
import Spinner from '../../UI/Spinner/Spinner';
import ErrorMessageForm from '../../UI/Error/FormErrorMessage'
import Layout from '../../../hoc/Layout/Layout'

class SignIn extends Component {
  state = {
    isLoading: false,
    emailError: null,
    hasError: false,
    user: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      email: '',
      password: '',
    },
    userValidationRules: {
      firstName: {
        required: true,
        minLength: 2,
        maxLength: 15,
        letterOnly: true,
      },
      lastName: {
        required: true,
        minLength: 2,
        maxLength: 20,
        letterOnly: true,
      },
      phone: {
        required: true,
        regExc: /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/,
      },
      address: { required: true, minLength: 2, maxLength: 20 },
      email: {
        required: true,
        regExc: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
      password: { required: true, minLength: 8, maxLength: 15 },
    },
    userValid: {
      firstName: { valid: false, touched: false, errmessage: '' },
      lastName: { valid: false, touched: false, errmessage: '' },
      phone: { valid: false, touched: false, errmessage: '' },
      address: { valid: false, touched: false, errmessage: '' },
      email: { valid: false, touched: false, errmessage: '' },
      password: { valid: false, touched: false, errmessage: '' },
    },
    isValidForm: false,
  };
  handleChange = (input) => (e) => {
    e.preventDefault();
    let updatedUser = this.state.user;
    let validUser = this.state.userValid;
    updatedUser[input] = e.target.value;
    validUser[input].touched = true;
    validUser[input].errmessage = checkValidity(
      updatedUser[input],
      this.state.userValidationRules[input]
    );
    validUser[input].valid = validUser[input].errmessage === '';

    let validForm = true;
    for (let field in validUser) {
      validForm = validUser[field].valid && validForm;
    }

    this.setState({
      user: updatedUser,
      userValid: validUser,
      isValidForm: validForm,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({isLoading: true});
    axios
      .post('user/register', this.state.user)
      .then((res) => {
        this.setState({ emailError: null, isLoading: false, hasError: false });
        this.props.onAuth(this.state.user.email, this.state.user.password);
      })
      .then(() => {
        const image = require(`../../../assets/images/logo3.png`);
        const dreamCream = 'Dream Cream';
        const subject = 'ברוכה הבאה מDream Cream';
        const body = `<div style="width: 50%; font-size: 18px;"><p style="width:100%; padding: 36px; background-color: #8cb8a69f;">
          היי ${this.state.user.firstName}</p> <div style="width:100%; padding: 36px; background-color: #8cb8a64b;"><p>ברוכה הבאה לאתר שלנו</p> <p>אנו שמחים שהצטרפת לקהל לקחותינו המרוצים ומקווים שתהנה</p><p>${dreamCream} מציעה חווית קניה יוצאת דופן ומגוון עשיר ונרחב של מוצרים</p><p>אנחנו פה לשירותך לכל שאלה ומבטיחים מענה זריז ומהיר</p><p>צוות <b>${dreamCream}</b></p></div><p style="width:100%; height: 100px; padding: 36px; background-color: rgb(243, 233, 215); background-image: url('https://d2cbg94ubxgsnp.cloudfront.net/Pictures/1024x536/4/0/8/132408_shutterstock_406445776.jpg'); background-position: center; background-size: contain; background-repeat: no-repeat;
          "></p></div>`;
        sendEmail(this.state.user.email, subject, body);
      })
      .catch((err) => {
        console.log(err.response)
        if(err.response.status === 404){
          this.setState({ hasError: true, isLoading: false });
        }
        else{
          this.setState({ emailError: err.response.data.Message, isLoading: false });
        }
      });
  };

  render() {
    let error = null;
    error = <p style={{ color: 'red' }}>{this.state.emailError}</p>;
    var urlParams = new URLSearchParams(window.location.search);
    let redirectTo = urlParams.get('redirectTo');
    let path = '/';
    if (redirectTo !== null) path = redirectTo;
    let authRedirect = null;
    if (this.props.isAuthenticated) authRedirect = <Redirect to={path} />;
    if(this.state.isLoading){
      return <Layout> <Spinner /></Layout>
    }
    if(this.state.hasError){
      return <Layout>
              <div className="container"> 
                <ErrorMessageForm />
              </div>
              </Layout>
    }
    return (
      <Layout>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4'></div>
          <div className='col-md-4'>
            <h4 style={{ textAlign: 'center' }}>הירשם</h4>
            <hr></hr>
            <form
              onSubmit={this.handleSubmit}
              style={{ padding: 0 }}
              className={[classes.Form].join(' ')}
            >
              {authRedirect}
              <div className='row'>
                <div className='col-lg-6 col-md-12'>
                  <Input
                    type='text'
                    name='first-name'
                    inputtype='input'
                    label='שם פרטי'
                    value={this.state.user.firstName}
                    onChange={this.handleChange('firstName')}
                    invalid={(!this.state.userValid.firstName.valid).toString()}
                    touched={this.state.userValid.firstName.touched.toString()}
                    errmessage={this.state.userValid.firstName.errmessage}
                  />
                </div>
                <div className='col-lg-6 col-md-12'>
                  <Input
                    type='text'
                    name='last-name'
                    inputtype='input'
                    label='שם משפחה'
                    value={this.state.user.lastName}
                    onChange={this.handleChange('lastName')}
                    invalid={(!this.state.userValid.lastName.valid).toString()}
                    touched={this.state.userValid.lastName.touched.toString()}
                    errmessage={this.state.userValid.lastName.errmessage}
                  />
                </div>
              </div>
              <Input
                type='text'
                name='phone'
                inputtype='input'
                label='טלפון'
                value={this.state.user.phone}
                onChange={this.handleChange('phone')}
                invalid={(!this.state.userValid.phone.valid).toString()}
                touched={this.state.userValid.phone.touched.toString()}
                errmessage={this.state.userValid.phone.errmessage}
              />
              <Input
                type='text'
                name='address'
                inputtype='input'
                label='כתובת'
                value={this.state.user.address}
                onChange={this.handleChange('address')}
                invalid={(!this.state.userValid.address.valid).toString()}
                touched={this.state.userValid.address.touched.toString()}
                errmessage={this.state.userValid.address.errmessage}
              />
              <Input
                type='email'
                name='email'
                inputtype='input'
                label='מייל'
                value={this.state.user.email}
                onChange={this.handleChange('email')}
                invalid={(!this.state.userValid.email.valid).toString()}
                touched={this.state.userValid.email.touched.toString()}
                errmessage={this.state.userValid.email.errmessage}
              />
              {error}
              <Input
                type='password'
                name='password'
                inputtype='input'
                label='סיסמה'
                value={this.state.user.password}
                onChange={this.handleChange('password')}
                invalid={(!this.state.userValid.password.valid).toString()}
                touched={this.state.userValid.password.touched.toString()}
                errmessage={this.state.userValid.password.errmessage}
              />
              <div>
                <PinkButton
                  text='הירשם'
                  type='submit'
                  disabled={!this.state.isValidForm}
                />
              </div>
            </form>
          </div>
          <div className='col-md-4'></div>
        </div>
      </div>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, path) =>
      dispatch(AuthActions.auth(email, password, path)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
