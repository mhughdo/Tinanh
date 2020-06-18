import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
} from 'native-base';
import normalize from 'react-native-normalize';

const AccountDetails = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [school, setSchool] = useState('');
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
          <Button transparent>
            <Text>Done</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <List style={styles.list}>
          <Separator bordered style={styles.separator}>
            <Text style={styles.separatorText}>PUBLIC PROFILE</Text>
          </Separator>
          <Item title="Name" value={name} setValue={setName} />
          <Item title="Age" value={age} setValue={setAge} />
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
