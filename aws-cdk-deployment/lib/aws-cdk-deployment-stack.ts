import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

require('dotenv').config()

const config = {
  env: {
    account: process.env.AWS_ACCOUNT_NUMBER,
    region: process.env.AWS_REGION
  }
}

export class ImperiumDealsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, { ...props, env: config.env });

    const defaultVPC = ec2.Vpc.fromLookup(this, 'ImperiumDealsVpc', {
      isDefault: true,
    });

    const role = new iam.Role(
      this,
      'simple-instance-1-role',
      { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }
    )

    const secruityGroup = new ec2.SecurityGroup(this, 'simple-instance-1-sg', {
      vpc: defaultVPC,
      allowAllOutbound: true,
      securityGroupName: 'simple-instance-1-sg',
    });

    secruityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow ssh access from the world'
    );

    secruityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow http access from the world'
    );

    secruityGroup.addIngressRule
      (ec2.Peer.anyIpv4(),
        ec2.Port.tcp(443),
        'allow https access from the world'
      );


    const instance = new ec2.Instance(this, 'simple-instance-1', {
      vpc: defaultVPC,
      role: role,
      securityGroup: secruityGroup,
      instanceName: 'imperiumdeals',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.genericLinux({
        'us-west-1': 'ami-07d2649d67dbe8900',
      })
    });

    // cdk lets us output prperties of the resources we create after they are created
    // we want the ip address of this new instance so we can ssh into it later
    new cdk.CfnOutput(this, 'simple-instance-1-output', {
      value: instance.instancePublicIp
    })

  }
}