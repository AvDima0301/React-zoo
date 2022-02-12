import axios from "axios";
import { Form, Input, List} from 'antd';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import React, { useEffect, useState } from "react";
import { IAnimalResult } from "./types";
import { useNavigate } from "react-router";

const HomePage: React.FC = () => {
    const [animals, setAnimals] = React.useState<IAnimalResult[]>([]);
    //const [delId, setDelId] = React.useState<number>();
    const [addName, setAddName] = React.useState<String>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigator = useNavigate();
    
    const { confirm } = Modal;
    function showDeleteConfirm(id: number) {
        confirm({
          title: 'Are you sure delete this animal?',
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            i = id;
            DelAnimal();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }

    let i = 0;

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        console.log(addName);

        const res = await axios
        .post(`http://localhost:8084/create?name=${addName}`);
        console.log(res);

        getAnimals();

        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getAnimals = async () => {
        try {
            const res = await axios
                .get('http://localhost:8084/')
            const { data } = res;
            //console.log("res: ", res.data);
            setAnimals(data);
        } catch (ex) {
            console.log("Problem: ", ex);
        }
    }

    const DelAnimal = async() => {
        try {
            getAnimals();
            console.log("delete func",i);
            const res = await axios
                .delete(`http://localhost:8084/del?id=${i}`);
            console.log(res);
            getAnimals();
            // navigator("/re-render");
            // navigator("/");
            i=0;
                
        } catch(ex) {
            console.log("Problem", ex);
        }
    }

    useEffect(() => {
        //console.clear();
        getAnimals();
        //console.log(addName, delId);
    }, []);

    return (
        <div style={{margin: "20px"}}>
            <List size="large">
                {animals.map(animal => {
                    return(
                        <List.Item>
                                {console.log(animal.id, animal.name)}
                                <pre><h3>Id: {animal.id}     Name: {animal.name}</h3></pre>
                                <Button onClick={() => {showDeleteConfirm(animal.id)}} type="dashed" style={{marginLeft: "10px", justifySelf: "flex-end"}}>
                                    Delete
                                </Button>
                        </List.Item>
                    );
                })}
            </List>
            <Button type="primary" onClick={showModal}>
                Add animal
            </Button>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form.Item 
                name="name" 
                label="Name of animal" 
                rules={[{ required: true }]}>
                    <Input onChange={ e => setAddName(e.target.value)} />
                </Form.Item>
            </Modal>
            {/* {console.log("animals: ",animals)} */}
            
            {/* <Button type="primary" onClick={() => setVisible(true)} style={{marginTop:"10px"}}>
                Delete animal
            </Button>
            <Modal
                title="Select animal"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}>
                    <DeleteAnimal  />
            </Modal> */}
        </div>
        
    );
}

export default HomePage;