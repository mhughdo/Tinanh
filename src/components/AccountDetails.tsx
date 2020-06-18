import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '@hooks/useAuth';
import { db, FirebaseFirestoreTypes } from '@utils/index';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Separator,
  Left,
  Button,
  Icon,
  Body,
  Right,
  Title,
  DatePicker,
  Toast,
} from 'native-base';
import normalize from 'react-native-normalize';
import { userType } from '@reducers/appReducer';

type UserType = userType & {
  displayName: string;
  dob: FirebaseFirestoreTypes.Timestamp;
  bio: string;
  school: string;
};

const AccountDetails = () => {
  const navigation = useNavigation();
  const { auth } = useAuth();
  useEffect(() => {
    console.log(auth);
    let { displayName, dob, bio, school } = auth as UserType;
    let date = dob.toDate().getDate();
    let month = dob.toDate().getMonth() + 1;
    let year = dob.toDate().getFullYear();
    setDisplayName(displayName);
    setDob(dob.toDate());
    setBio(bio);
    setTempDob(`${date}/${month}/${year}`);
    setSchool(school);
  }, [auth]);
  const [displayName, setDisplayName] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [dob, setDob] = useState<any>();
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');

  const onUpdate = async () => {
    await db
      .doc(`users/${auth?.id}`)
      .set({ displayName, dob: new Date(dob), bio, school }, { merge: true })
      .then(() => {
        Toast.show({
          text: 'User information was updated successfully!',
          buttonText: 'Okay',
          type: 'success',
          duration: 3000,
        });
      });
  };
  return (
    <Container style={styles.container}>
      <Header style={styles.header}>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
            <Text>Back</Text>
          </Button>
        </Left>
        <Body>
          <Title>Edit Profile</Title>
        </Body>
        <Right>
          <Button transparent onPress={onUpdate}>
            <Text>Done</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <List style={styles.list}>
          <Separator bordered style={styles.separator}>
            <Text style={styles.separatorText}>PUBLIC PROFILE</Text>
          </Separator>
          <Item title="Name" value={displayName} setValue={setDisplayName} />
          <ListItem icon>
            <Body>
              <Text>Age</Text>
            </Body>
            <Right style={{ maxWidth: '50%' }}>
              <DatePicker placeHolderText={tempDob} onDateChange={setDob} />
            </Right>
          </ListItem>
          <Item title="Bio" value={bio} setValue={setBio} />
          <Item title="School" value={school} setValue={setSchool} />
        </List>
      </Content>
    </Container>
  );
};

const Item = ({
  title,
  value,
  setValue,
  keyboardType = 'default',
}: {
  title: string;
  value: string;
  setValue: Function;
  keyboardType?: string;
}) => {
  return (
    <ListItem icon>
      <Body>
        <Text>{title}</Text>
      </Body>
      <Right style={{ maxWidth: '50%' }}>
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          placeholder={title}
          style={{ fontWeight: '500', fontSize: normalize(14) }}
          keyboardType={keyboardType}
        />
      </Right>
    </ListItem>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  list: {
    backgroundColor: '#ffffff',
  },
  separator: {
    height: normalize(50),
    justifyContent: 'flex-end',
  },
  separatorText: {
    fontSize: normalize(13),
  },
  header: {
    backgroundColor: '#ffffff',
    padding: normalize(15),
  },
});
