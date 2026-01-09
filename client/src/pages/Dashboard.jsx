import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { counts } from '../utils/data.js'
import CountsCard from '../components/Cards/CountsCards.jsx'
import WeeklyStatCard from '../components/Cards/WeeklyStatCard.jsx';
import CategoryChart from '../components/Cards/CategoryChart.jsx';
import AddWorkout from '../components/AddWorkout.jsx';
import { Work } from '@mui/icons-material';
import WorkoutCard from '../components/Cards/WorkoutCard.jsx';
import { getDashboardDetails, addWorkout, getWorkouts } from '../api/index.js';


const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 768px) {
    gap: 12px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const Section = styled.div`
    display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 768px) {
    gap: 12px;
}
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [buttonLoading, setButtonLoading] = useState(false);
    const [todaysWorkouts, setTodaysWorkouts ] = useState([]);
    const [workout, setWorkout] = useState(`#Legs
-Back_Squat
-5 setsX15 reps
-30 kg
-10 min`);

    const dashboardData = async() => {
        setLoading(true);
        const token = localStorage.getItem("fittrack-app-token")
        await getDashboardDetails(token).then((res) => {
            setData(res.data);
            console.log(res.data);
            setLoading(false);
        });
    };

    const getTodaysWorkout = async() => {
        setLoading(true);
        const token = localStorage.getItem("fittrack-app-token")
        await getWorkouts(token, "").then((res) => {
            setTodaysWorkouts(res?.data?.todaysWorkouts);
            console.log(res.data);
            setLoading(false);
        });
    };

    const addNewWorkouts = async () => {
        setButtonLoading(true);
        const token = localStorage.getItem("fittrack-app-token");
        await addWorkout(token, { workoutString: workout }).then((res)=>{
            dashboardData();
            getTodaysWorkout();
            setButtonLoading(false);
        }).catch((error) => {
            alert(error)
        });
    };

    useEffect(() => {
        dashboardData();
        getTodaysWorkout();
    }, []);

  return (
    <Container>
      <Wrapper> 
        <Title>Dashboard</Title>
        <FlexWrap>
            {counts.map((item)=> (
                <CountsCard item={item} data={data} />
            ))}
        </FlexWrap>
        <FlexWrap>
            <WeeklyStatCard data ={data} />
            <CategoryChart data={data} />
            <AddWorkout 
            workout={workout} 
            setWorkout={setWorkout} 
            addNewWorkouts={addNewWorkouts}
            buttonLoading = {buttonLoading}
            />
        </FlexWrap>

        <Section>
            <Title>Todays Workouts</Title>
            <CardWrapper>
                {todaysWorkouts.map((workout) => (
                    <WorkoutCard workout={workout} />
                ))}
                
            </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default Dashboard
