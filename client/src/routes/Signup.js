import React from 'react';
import {
  AsyncStorage,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    fontSize: 20,
    marginBottom: 15,
    height: 35,
  },
});

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const defaultState = {
  values: {
    email: '',
    username: '',
    password: '',
  },
  errors: {},
};

export default class Signup extends React.Component {
  state = defaultState;

  onChangeText = (key, value) => {
    this.setState(state => ({
      values: { ...state.values, [key]: value },
    }));
  };

  onSubmit = async signup => {
    await signup();

    this.setState(defaultState);
  };

  render() {
    const {
      values: { name, email, password },
      errors,
    } = this.state;

    return (
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Mutation
          mutation={SIGNUP_MUTATION}
          variables={{
            email,
            name,
            password,
          }}
        >
          {(signup, { data, loading, error }) => {
            if (error) {
              this.setState({
                errors: {
                  email: 'Already Taken',
                },
              });

              return null;
            }

            if (!loading && data) {
              const { token } = data.signup;
              AsyncStorage.setItem('@ecommerce/token', token);
            }

            return (
              <View style={{ width: 200 }}>
                <TextInput
                  onChangeText={text => this.onChangeText('name', text)}
                  value={name}
                  style={styles.field}
                  placeholder="Name"
                  autoCapitalize="none"
                />
                {errors.email && <Text>{errors.email}</Text>}
                <TextInput
                  onChangeText={text => this.onChangeText('email', text)}
                  value={email}
                  style={styles.field}
                  placeholder="E-mail"
                  autoCapitalize="none"
                />
                <TextInput
                  onChangeText={text => this.onChangeText('password', text)}
                  value={password}
                  style={styles.field}
                  placeholder="Password"
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Button
                  disabled={loading}
                  title="Create Account"
                  onPress={() => this.onSubmit(signup)}
                />
              </View>
            );
          }}
        </Mutation>
      </View>
    );
  }
}
