"use client"

import * as React from 'react';
import { Container, Box, Button, Stack, Typography, Stepper, Step, StepLabel, Checkbox, FormControlLabel, FormGroup, Chip } from "@mui/material";
import Link from "next/link";
import { useRouter } from 'next/router';
import ToggleButton from '@mui/material/ToggleButton';
import { Check } from '@mui/icons-material';


export default function Page() {
	const [activeStep, setActiveStep] = React.useState(0);

	const frequencyListenHandler = () => {
		setActiveStep(1)
	}
	return (
		<Container>
			<Box>
				<Typography variant='h1' fontSize={20}>好きなジャンルを選んでください</Typography>
				<FormGroup>
					<FormControlLabel control={<Chip label="aaa" />} label="" />
				</FormGroup>
			</Box>
		</Container>
	)
}
