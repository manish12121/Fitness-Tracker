import React from "react";
import styled from "styled-components";
import { BarChart } from "@mui/x-charts/BarChart";


const Card = styled.div`
flex: 1;
  padding: 24px;
  border-radius: 14px;
  min-width: 280px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }

`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;  

const WeeklyStatCard = ({ data }) => {
  const weeks = data?.totalWeeksCaloriesBurnt?.weeks || [];

  const calories =
    data?.totalWeeksCaloriesBurnt?.caloriesBurned ||
    data?.totalWeeksCaloriesBurnt?.caloriesBurnt ||
    [];

  const hasData =
    weeks.length > 0 &&
    calories.length > 0 &&
    weeks.length === calories.length;
    
  return (
    <Card>
      <Title>Weekly Calories Burnt</Title>

      {hasData ? (
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: weeks,
            },
          ]}
          series={[
            {
              data: calories,
            },
          ]}
          height={300}
        />
      ) : (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            opacity: 0.6,
            fontSize: "14px",
          }}
        >
          No weekly data available
        </div>
      )}
    </Card>
  );
};

export default WeeklyStatCard;
