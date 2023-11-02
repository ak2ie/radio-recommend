import * as React from 'react';
import { Container, Box, Button, Stack, Typography, Grid } from "@mui/material";
import { blue } from '@mui/material/colors';

export default function Home() {
	return (
		<Container>
			<Box>
				<Typography variant='h1' fontSize={40} color={blue[300]} fontWeight={700}>お好きなジャンルを選んでください</Typography>
				<Grid spacing={50}>
					<Button variant='outlined' color='primary' sx={{ width: 100, height: 100 }}>よく聴く</Button>
					<Button variant='outlined' color='secondary'>あまり聴かない</Button>
				</Grid>
			</Box>
		</Container>
	)
}
