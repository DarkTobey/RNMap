import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet, List, FlatList, SectionList, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Button, Card, Toast } from 'antd-mobile';
import Http from "../../utils/http";
import Config from "../../utils/config";

export default class ListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            start: 0,
            length: 10,
            total: 10,
            dataList: [],
            refreshing: false,
            isEnd: false,
        };

        this.nav = this.props.navigation.navigate;
    }

    componentDidMount = () => {
        this.getDataList(this.state.key);
    }

    getDataList = (key) => {
        if (this.state.start >= this.state.total) {
            Toast.info("没有更多数据了！", 2, null, false);
            return;
        }

        var d = { Rows: [], Total: this.state.start + 11 };
        for (i = 0; i < 10; i++) {
            d.Rows.push({
                ID: "ID" + this.state.start + i,
                Title: "Title" + this.state.start + i,
                Body: 'Body' + this.state.start + i,
                Note: "Note" + this.state.start + i,
            });
        }

        this.setState({
            start: this.state.start + this.state.length,
            total: d.Total,
            dataList: d.Rows.concat(this.state.dataList)
        });
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getDataList(this.state.key);
        this.setState({ refreshing: false });
    }

    onEndReached = () => {
        //Toast.info("到底了", 2, null, false);
    }

    startSearch = (key) => {
        this.setState({
            start: 0,
            length: 10,
            total: 10,
            key: key,
            dataList: [],
        })
        this.getDataList(key)
    }

    render() {
        return (
            <View style={styles.listContainer}  >
                <FlatList data={this.state.dataList} refreshing={this.state.refreshing} onRefresh={this.onRefresh} onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.1} ListFooterComponent={() => { return <Text></Text>; }}
                    keyExtractor={(item, index) => { return item.ID }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity key={index} activeOpacity={1} onPress={() => { this.nav("detail", { ID: item.ID }) }}>
                                <Card style={styles.cardContainer} >
                                    <Card.Header title={item.Title} />
                                    <Card.Body>
                                        <Text>{item.Body}</Text>
                                    </Card.Body>
                                    <Card.Footer content={item.Note} />
                                </Card>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: '#f5f5f9',
        paddingHorizontal: 8,
    },
    cardContainer: {
        marginBottom: 10
    }
});
