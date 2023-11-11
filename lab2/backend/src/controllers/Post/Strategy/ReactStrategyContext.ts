import { Request, Response } from 'express';
import { strategies } from './index';
import { IStrategy } from '../../../interfaces/IPost/Strategy/IStrategy';

export class ReactStrategyContext {
    private strategy: IStrategy;

    constructor() {
        this.strategy = new strategies.like();
    }

    public performAction(req: Request, res: Response): void {
        const { reactionType } = req.params;

        switch (reactionType) {
            case 'like':
                this.strategy = new strategies.like();
                break;
            case 'dislike':
                this.strategy = new strategies.dislike();
                break;
            case 'comment':
                this.strategy = new strategies.comment();
                break;
            default:
                throw new Error('Invalid reaction type.');
        }

        this.strategy.performAction(req, res);
    }
}
