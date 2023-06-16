// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope,id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns()
    .teams();
  
    blueprints.CodePipelineStack.builder()
      .name("eks-blueprints-workshop-pipeline")
      .owner("junnoli")
      .repository({
          repoUrl: 'my-eks-blueprints',
          credentialsSecretName: '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',
          targetRevision: 'main'
      })
      .wave({
        id: "envs",
        stages: [   
          { id: "prod", stackBuilder: blueprint.clone('us-east-1')}
        ]
      })
      .build(scope, id+'-stack', { env:{ account:props?.env?.account, region:props?.env?.region}});
      
  }
}
