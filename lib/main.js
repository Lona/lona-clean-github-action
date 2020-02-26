"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const node_fetch_1 = __importDefault(require("node-fetch"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput("github_token", { required: true });
            const baseURL = core.getInput("lona_api_base_url");
            const refName = core.getInput("ref_name", { required: true });
            const refType = core.getInput("ref_type", { required: true });
            const { GITHUB_REPOSITORY, GITHUB_SHA } = process.env;
            if (!GITHUB_REPOSITORY) {
                core.setFailed("Missing GITHUB_REPOSITORY");
                return;
            }
            if (!GITHUB_SHA) {
                core.setFailed("Missing GITHUB_SHA");
                return;
            }
            const ref = `refs/${refType === "tag" ? "tags" : "heads"}/${refName}`;
            const [owner, repo] = GITHUB_REPOSITORY.split("/");
            const github = new github_1.GitHub(token);
            const deployments = yield github.repos.listDeployments({
                repo,
                owner,
                ref
            });
            if (deployments && deployments.data.length) {
                yield github.repos.createDeploymentStatus({
                    deployment_id: deployments.data[0].id,
                    repo,
                    owner,
                    state: "inactive",
                    description: "Deleted the GitHub ref",
                    headers: {
                        Accept: "application/vnd.github.ant-man-preview+json"
                    }
                });
            }
            const res = yield node_fetch_1.default(`${baseURL}/cleanGitRef?github_token=${encodeURIComponent(token)}&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&ref=${encodeURIComponent(ref)}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const error = yield res.json();
                core.setFailed(error.message);
                return;
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
